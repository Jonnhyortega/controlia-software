"use client";

import { useState, useEffect, useRef } from "react";
import { useCustomization } from "../../../../context/CustomizationContext";
import { useAuth } from "../../../../context/authContext";
import { Save, Palette, type LucideIcon, LayoutTemplate, Clock, DollarSign, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../../../context/ToastContext";
import { uploadLogo } from "../../../../utils/api";

import Loading from "../../../../components/loading";

// Componentes de UI simples
const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-[#18181b] rounded-md shadow-sm border border-gray-200 dark:border-[#27272a] overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-gray-100 dark:border-[#27272a] bg-gray-50/50 dark:bg-[#1f1f1f]/30 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md text-primary">
            <Icon size={20} />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    </div>
    <div className="p-6 space-y-6">
        {children}
    </div>
  </motion.div>
);

export default function CustomizationPage() {
  const { settings, updateSettings, loading } = useCustomization();
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  
  // Logo Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  // Sincronizar estado local cuando carguen los settings
  useEffect(() => {
    if (!loading && settings) {
      setFormData(settings);
      if (settings.logoUrl) setPreviewLogo(settings.logoUrl);
    }
  }, [settings, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast.success("Configuración actualizada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Preview inmediato
      const objectUrl = URL.createObjectURL(file);
      setPreviewLogo(objectUrl);

      setIsUploading(true);
      try {
          // Subir archivo real
          const res = await uploadLogo(file);
          // Actualizar URL en el form
          setFormData(prev => ({ ...prev, logoUrl: res.url }));
          // También actualizar globalmente si se desea (aunque handleSave lo hará oficial)
          // updateSettings({ logoUrl: res.url }); 
          toast.success("Logo subido correctamente");
      } catch (error) {
          console.error(error);
          toast.error("Error al subir el logo");
          // Revertir preview si falla
          setPreviewLogo(settings.logoUrl || null);
      } finally {
          setIsUploading(false);
      }
  };

  const handleRemoveLogo = () => {
      setPreviewLogo(null);
      setFormData(prev => ({ ...prev, logoUrl: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Pre-defined fancy colors
  const colorPalettes = [
    { name: "Azul Controlia", hex: "#2563eb" },
    { name: "Violeta Profundo", hex: "#7c3aed" },
    { name: "Esmeralda", hex: "#059669" },
    { name: "Rosa Vibrante", hex: "#db2777" },
    { name: "Naranja", hex: "#ea580c" },
    { name: "Negro", hex: "#000000" },
  ];

  if (loading) return <div className="p-10 text-center">Cargando preferencias...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 relative">
      {(isSaving || isUploading) && (
          <Loading fullscreen message={isUploading ? "Subiendo logo..." : "Guardando cambios..."} />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/60 rounded-md shadow-lg shadow-primary/25 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Palette className="w-8 h-8 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Personalización</h1>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ajusta la apariencia del sistema a tu marca</p>
            </div>
         </div>
         
         <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-md font-bold shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
         >
            <Save size={18} />
            Guardar Cambios
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
          
          {/* 1. Logo del Negocio */}
          <SectionCard title="Logo del Negocio" icon={ImageIcon}>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                 {/* Preview Box */}
                 <div className="relative group">
                    <div className={`w-32 h-32 rounded-md border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-900 transition-colors ${previewLogo ? 'border-primary/50' : 'border-gray-300 dark:border-zinc-700'}`}>
                        {previewLogo ? (
                            <img src={previewLogo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                        ) : (
                            <ImageIcon className="text-gray-400" size={32} />
                        )}
                    </div>
                    {/* Botón flotante para borrar */}
                    {previewLogo && (
                        <button 
                           onClick={handleRemoveLogo}
                           className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                           title="Eliminar logo"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                 </div>

                 <div className="flex-1 space-y-4">
                     <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sube tu logo</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Se mostrará en los recibos, en la barra lateral y en la pantalla de carga.
                            Recomendamos formato PNG con fondo transparente.
                        </p>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleLogoUpload}
                        />
                        <button
                           onClick={() => fileInputRef.current?.click()}
                           disabled={isUploading}
                           className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        >
                            {isUploading ? (
                                <span className="animate-pulse">Subiendo...</span>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    Seleccionar Imagen
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-400">Máx. 2MB</p>
                     </div>
                 </div>
              </div>
          </SectionCard>

          {/* 2. Apariencia y Color */}
          <SectionCard title="Apariencia" icon={Palette}>
              <div className="space-y-6">
                 <div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Color Principal</label>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {colorPalettes.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => setFormData(prev => ({ ...prev, primaryColor: color.hex }))}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${formData.primaryColor === color.hex ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-zinc-900" : "border-transparent"}`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                         <div className="relative group">
                            <input 
                                type="color" 
                                name="primaryColor"
                                value={formData.primaryColor}
                                onChange={handleChange}
                                className="w-10 h-10 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
                            />
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tema del Sistema</label>
                        <select 
                            name="theme"
                            value={formData.theme}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                            <option value="light">Claro (Light Mode)</option>
                            <option value="dark">Oscuro (Dark Mode)</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Moneda</label>
                         <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select 
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                            >
                                <option value="ARS">Peso Argentino (ARS)</option>
                                <option value="USD">Dólar Estadounidense (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="BRL">Real Brasileño (BRL)</option>
                                <option value="CLP">Peso Chileno (CLP)</option>
                                <option value="UYU">Peso Uruguayo (UYU)</option>
                            </select>
                        </div>
                    </div>
                 </div>
              </div>
          </SectionCard>

           {/* 3. Formatos Regionales */}
           <SectionCard title="Configuración Regional" icon={Clock}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Formato de Fecha</label>
                        <select 
                            name="dateFormat"
                            value={formData.dateFormat}
                            onChange={handleChange}
                             className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Formato de Hora</label>
                         <select 
                            name="timeFormat"
                            value={formData.timeFormat}
                            onChange={handleChange}
                             className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                            <option value="HH:mm">24 Horas (14:30)</option>
                            <option value="hh:mm a">12 Horas (02:30 PM)</option>
                        </select>
                    </div>
               </div>
           </SectionCard>

      </div>
    </div>
  );
}
