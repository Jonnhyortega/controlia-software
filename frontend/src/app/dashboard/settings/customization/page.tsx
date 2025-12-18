"use client";

import { useEffect, useState } from "react";
import { uploadLogo, resetCustomization } from "../../../../utils/api";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/authContext";
import { useCustomization, CustomizationData } from "../../../../context/CustomizationContext";
import { ConfirmDialog } from "../../../dashboard/components/confirmDialog";
import { Upload, Save, RefreshCcw, Trash2, Palette, Globe, Layout, Image as ImageIcon, Moon, Sun } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { motion } from "framer-motion";

export default function CustomizationPage() {
  const toast = useToast();
  const { setUser } = useAuth();
  const { settings, updateSettings } = useCustomization();

  // Estado para los datos del formulario
  const [data, setData] = useState<Partial<CustomizationData>>({
    primaryColor: "#2563eb",
    secondaryColor: "",
    logoUrl: "",
    currency: "ARS",
    theme: "dark",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
  });

  // Estado para comparar cambios
  const [initialData, setInitialData] = useState<Partial<CustomizationData> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
  
  const [dialogConfig, setDialogConfig] = useState({
    title: "Confirmar acción",
    message: "¿Estás seguro de realizar esta acción?",
    confirmText: "Confirmar"
  });

  // 1️⃣ Cargar datos iniciales desde el contexto
  useEffect(() => {
    if (settings && !initialData) {
      const initInfo = {
        primaryColor: settings.primaryColor || "#2563eb",
        secondaryColor: settings.secondaryColor || "",
        logoUrl: settings.logoUrl || "",
        currency: settings.currency || "ARS",
        theme: settings.theme || "dark",
        dateFormat: settings.dateFormat || "DD/MM/YYYY",
        timeFormat: settings.timeFormat || "HH:mm",
      };
      
      setData(initInfo);
      setInitialData(initInfo);
    }
  }, [settings, initialData]);

  // 2️⃣ Actualizar initialData si se guardan los cambios exitosamente 
  useEffect(() => {
    if (settings && initialData) {
        const currentSettings = {
            primaryColor: settings.primaryColor || "#2563eb",
            secondaryColor: settings.secondaryColor || "",
            logoUrl: settings.logoUrl || "",
            currency: settings.currency || "ARS",
            theme: settings.theme || "dark",
            dateFormat: settings.dateFormat || "DD/MM/YYYY",
            timeFormat: settings.timeFormat || "HH:mm",
        };
        // Si el contexto cambió (por un guardado exitoso), actualizamos la referencia inicial
        if (JSON.stringify(currentSettings) !== JSON.stringify(initialData)) {
            setInitialData(currentSettings);
        }
    }
  }, [settings]);

  // 3️⃣ Detectar Cambios y PREVIEW Inmediato del Tema/Color
  useEffect(() => {
    if (!initialData) return;

    // A) Detectar dirty state
    const isDirty = JSON.stringify(data) !== JSON.stringify(initialData);
    setHasChanges(isDirty);

    // B) Preview Inmediato (Manipulación directa del DOM)
    // Esto permite "ver" el cambio sin persistirlo en BD
    const root = document.documentElement;
    
    // Tema Claro/Oscuro
    if (data.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    // Colores CSS Vars
    if (data.primaryColor) root.style.setProperty("--primary-color", data.primaryColor);
    if (data.secondaryColor) root.style.setProperty("--secondary-color", data.secondaryColor);

  }, [data, initialData]);


  // 4️⃣ Cleanup: Revertir cambios visuales si salimos sin guardar
  // Usamos una referencia a settings para no depender de él en el efecto de cleanup
  // y evitar re-ejecuciones innecesarias, pero asegurarnos de tener el valor real al desmontar.
  useEffect(() => {
    return () => {
      // Al desmontar, forzamos que el DOM coincida con lo que hay en 'settings' (Contexto)
      // Nota: settings podría ser closure-stale, pero en un componente Page al navegar, 
      // esto debería bastar si leemos de una ref o si aceptamos re-render.
      // Para simplificar, confiamos en que al navegar, el ContextProvider volverá a aplicar su efecto
      // o nosotros lo forzamos aqui.
      
      // Accedemos a la instancia de settings GLOBAL en el momento del desmontaje?
      // React refs son mejores para esto.
    };
  }, []);

  // Efecto separado para manejar el Revert real dependiendo de settings
  useEffect(() => {
      return () => {
          if (settings) {
              const root = document.documentElement;
              if (settings.theme === "dark") root.classList.add("dark");
              else root.classList.remove("dark");
              
              root.style.setProperty("--primary-color", settings.primaryColor || "#2563eb");
              if (settings.secondaryColor) root.style.setProperty("--secondary-color", settings.secondaryColor);
          }
      }
  }, [settings]); 


  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    if (!hasChanges) return;
    try {
      await updateSettings(data);
      
      // Actualizamos el usuario globalmente para que se refleje el nuevo logo en el Navbar
      if (data.logoUrl) {
        setUser((prev) => {
           if(!prev) return null;
           return { ...prev, logoUrl: data.logoUrl };
        });
      }

      toast.success("Configuración guardada correctamente ✨");
    } catch {
      toast.error("Error al guardar la configuración ❌");
    }
  };

  const handleLogo = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadLogo(file);
      const newUrl = res.url;
      
      setData((prev: any) => ({ ...prev, logoUrl: newUrl }));
      
      // NOTA: No actualizamos setUser aquí para evitar que el Contexto recarge los settings
      // y deshabilite el botón de guardar. El usuario verá el logo en el Navbar al guardar.
      
      toast.success("Logo subido. Guarda los cambios para aplicar.");
    } catch {
      toast.error("No se pudo subir la imagen ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = () => {
    setPendingAction(() => async () => {
        // Solo lo quitamos del estado local
        setData((prev: any) => ({ ...prev, logoUrl: "" }));
        toast.info("Logo removido de la vista previa. Guarda para confirmar.");
    });

    setDialogConfig({
      title: "Eliminar logo",
      message: "¿Quitar el logo actual de la configuración?",
      confirmText: "Quitar"
    });
    setConfirmOpen(true);
  };

  const handleReset = () => {
    setPendingAction(() => async () => {
        try {
            // Reset en backend
            const res = await resetCustomization();
            
            // Actualizar local
            const resetData = {
                primaryColor: res.primaryColor,
                secondaryColor: res.secondaryColor,
                logoUrl: res.logoUrl,
                currency: res.currency,
                theme: res.theme,
                dateFormat: res.dateFormat,
                timeFormat: res.timeFormat
            };
            setData(resetData);
            
            // Actualizar User
            setUser((prev) => prev ? ({ ...prev, logoUrl: undefined }) : null);

            toast.success("Valores restablecidos a defecto");
        } catch {
            toast.error("Error al restablecer");
        }
    });

    setDialogConfig({
      title: "Restablecer configuración",
      message: "Esto devolverá la configuración a sus valores originales. ¿Continuar?",
      confirmText: "Sí, restaurar"
    });
    setConfirmOpen(true);
  };

  return (
    <RoleGuard role="admin">
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-7xl mx-auto space-y-8"
      >
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Palette className="text-primary" size={32} /> Personalización
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Ajusta la apariencia y configuración regional del sistema.</p>
          </div>
          
          <div className="flex gap-3">
             <button
              onClick={handleReset}
              className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#252525] text-red-500 px-5 py-2.5 rounded-md flex items-center gap-2 font-medium transition shadow-sm"
            >
              <RefreshCcw size={18} /> Restaurar
            </button>
            <button
              onClick={saveChanges}
              disabled={!hasChanges}
              className={`px-6 py-2.5 rounded-md flex items-center gap-2 font-bold shadow-lg transition transform active:scale-95 ${
                  hasChanges 
                  ? "bg-primary hover:bg-primary-700 text-white shadow-primary/20 cursor-pointer" 
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Save size={18} /> Guardar cambios
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA 1: LOGO Y TEMA */}
            <div className="space-y-8">
               
               {/* LOGO CARD */}
               <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <ImageIcon className="text-gray-400" size={20} /> Identidad Visual
                  </h2>
                  
                  <div className="bg-gray-200 dark:bg-[#0f0f0f] border border-dashed border-gray-300 dark:border-gray-700 rounded-md h-48 flex flex-col items-center justify-center relative overflow-hidden group">
                     {data.logoUrl ? (
                         <>
                            <img
                              key={data.logoUrl} // Force re-render on url change
                              src={data.logoUrl}
                              alt="Logo"
                              className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                            />
                             <button
                                onClick={handleDeleteLogo}
                                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Eliminar logo"
                              >
                                <Trash2 size={16} />
                              </button>
                         </>
                     ) : (
                       <div className="text-center text-gray-400">
                          <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm font-medium">Sin logo configurado</p>
                       </div>
                     )}

                     {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium backdrop-blur-sm">
                           Subiendo...
                        </div>
                     )}
                  </div>

                  <div className="mt-4">
                     <input
                        type="file"
                        className="hidden"
                        id="logoUpload"
                        onChange={handleLogo}
                        accept="image/*"
                      />
                     <label
                        htmlFor="logoUpload"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#252525] hover:bg-gray-200 dark:hover:bg-[#303030] text-gray-700 dark:text-gray-200 font-medium py-3 rounded-md cursor-pointer transition border border-gray-200 dark:border-transparent"
                      >
                        <Upload size={18} /> {data.logoUrl ? "Cambiar logo" : "Subir logo"}
                      </label>
                      <p className="text-xs text-center text-gray-400 mt-2">Recomendado: 500x500px, formato PNG</p>
                  </div>
               </div>

{/* THEME CARD REMOVED (Moved to Sidebar) */}

            </div>

            {/* COLUMNA 2 Y 3 (Resto de opciones) */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* COLORS CARD */}
               <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Palette className="text-gray-400" size={20} /> Paleta de Colores
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                      <div>
                         <label className="block text-sm font-medium text-gray-500 mb-2">Color Primario</label>
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                                <input
                                  type="color"
                                  value={data.primaryColor}
                                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                />
                            </div>
                            <div className="flex-1">
                               <input 
                                  type="text" 
                                  value={data.primaryColor}
                                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                                  className="w-full bg-gray-200 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm uppercase font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary"
                               />
                            </div>
                         </div>
                         <p className="text-xs text-gray-400 mt-2">Color principal para botones y destaques.</p>
                      </div>

                      <div>
                         <label className="block text-sm font-medium text-gray-500 mb-2">Color Secundario</label>
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                                <input
                                  type="color"
                                  value={data.secondaryColor}
                                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                />
                            </div>
                            <div className="flex-1">
                               <input 
                                  type="text" 
                                  value={data.secondaryColor}
                                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                                  className="w-full bg-gray-200 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm uppercase font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary"
                                  placeholder="#000000"
                               />
                            </div>
                         </div>
                         <p className="text-xs text-gray-400 mt-2">Opcional. Usado en bordes y acentos.</p>
                      </div>
                  </div>
               </div>

               {/* FORMATS CARD */}
               <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Globe className="text-gray-400" size={20} /> Región y Formatos
                  </h2>
                  
                  <div className="space-y-6">
                      
                      <div className="grid md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Moneda por defecto</label>
                            <select
                              value={data.currency}
                              onChange={(e) => handleChange("currency", e.target.value)}
                              className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                            >
                              <option value="ARS">Peso Argentino (ARS)</option>
                              <option value="USD">Dólar Americano (USD)</option>
                              <option value="BRL">Real Brasileño (BRL)</option>
                              <option value="EUR">Euro (EUR)</option>
                            </select>
                         </div>
                         
                         <div className="flex items-center pt-6">
                            <div className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-md border border-blue-100 dark:border-blue-900/30">
                               ℹ La moneda afecta cómo se muestran los precios en el sistema y reportes.
                            </div>
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                           <div>
                              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Formato de Fecha</label>
                              <select
                                value={data.dateFormat}
                                onChange={(e) => handleChange("dateFormat", e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                              >
                                <option value="DD/MM/YYYY">31/12/2024 (DD/MM/YYYY)</option>
                                <option value="MM/DD/YYYY">12/31/2024 (MM/DD/YYYY)</option>
                                <option value="YYYY-MM-DD">2024-12-31 (YYYY-MM-DD)</option>
                              </select>
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Formato de Hora</label>
                              <select
                                value={data.timeFormat}
                                onChange={(e) => handleChange("timeFormat", e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                              >
                                <option value="HH:mm">24 Horas (14:30)</option>
                                <option value="hh:mm A">12 Horas (02:30 PM)</option>
                              </select>
                           </div>
                      </div>

                  </div>
               </div>

            </div>
        </div>

        {/* CONFIRM DIALOG */}
        <ConfirmDialog
            open={confirmOpen}
            title={dialogConfig.title}
            message={dialogConfig.message}
            confirmText={dialogConfig.confirmText}
            cancelText="Cancelar"
            onConfirm={() => {
            setConfirmOpen(false);
            pendingAction && pendingAction();
            }}
            onCancel={() => setConfirmOpen(false)}
        />
      </motion.section>
    </RoleGuard>
  );
}
