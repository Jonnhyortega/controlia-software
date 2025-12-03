"use client";

import { useEffect, useState } from "react";
import {
  getCustomization,
  updateCustomization,
  uploadLogo,
  resetCustomization,
} from "../../../../utils/api";

import { useToast } from "../../../../context/ToastContext";
import { ConfirmDialog } from "../../../dashboard/components/confirmDialog";

import { Upload, Save, RefreshCcw } from "lucide-react";

export default function CustomizationPage() {
  const toast = useToast();

  const [data, setData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    logoUrl: "",
    currency: "ARS",
    theme: "dark",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
  });

  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCustomization();
        setData((prev) => ({ ...prev, ...res }));
      } catch {
        toast.error("Error al cargar configuración ❌");
      }
    })();
  }, []);

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      const res = await updateCustomization(data);
      setData(res);
      toast.success("Configuración guardada ✔");
    } catch {
      toast.error("Error al guardar ❌");
    }
  };

  const handleLogo = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const res = await uploadLogo(file);

      setData((prev: any) => ({
        ...prev,
        logoUrl: res.url,
      }));

      toast.success("Logo actualizado ✔");
    } catch {
      toast.error("No se pudo subir la imagen ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPendingAction(() => async () => {
      try {
        const res = await resetCustomization();
        setData(res);
        toast.success("Personalización restablecida ✔");
      } catch {
        toast.error("Error al restablecer ❌");
      }
    });

    setConfirmOpen(true);
  };

  return (
    <>
      <section className="p-6 space-y-10">
        <h1 className="text-3xl font-bold text-gray-800">Personalización</h1>
  
        <div className="grid md:grid-cols-2 gap-10">
  
          {/* LOGO */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800">Logo</h2>
  
            <div className="w-40 h-40 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <p className="text-gray-400 text-sm">Sin logo</p>
              )}
            </div>
  
            {uploading && (
              <p className="text-gray-500 text-sm">Subiendo...</p>
            )}
  
            <input
              type="file"
              className="hidden"
              id="logoUpload"
              onChange={handleLogo}
            />
  
            <label
              htmlFor="logoUpload"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white py-2 rounded-lg cursor-pointer transition"
            >
              <Upload size={18} /> Subir logo
            </label>
          </div>
  
          {/* INFORMACIÓN GENERAL */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Información general</h2>
  
            <div>
              <label className="text-gray-600 text-sm">Nombre del comercio</label>
              <input
                value={data.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                className="w-full mt-1 p-2 rounded border border-gray-300 bg-gray-50 text-gray-800"
              />
            </div>
  
            <div>
              <label className="text-gray-600 text-sm">Moneda</label>
              <select
                value={data.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full mt-1 p-2 rounded border border-gray-300 bg-gray-50 text-gray-800"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="BRL">BRL</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
  
            <div>
              <label className="text-gray-600 text-sm">Tema</label>
              <select
                value={data.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="w-full mt-1 p-2 rounded border border-gray-300 bg-gray-50 text-gray-800"
              >
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
              </select>
            </div>
          </div>
  
          {/* COLORES */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Colores</h2>
  
            <div>
              <label className="text-gray-600 text-sm">Color primario</label>
              <input
                type="color"
                value={data.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="h-12 w-full border border-gray-300 rounded mt-1 cursor-pointer"
              />
            </div>
  
            <div>
              <label className="text-gray-600 text-sm">Color secundario</label>
              <input
                type="color"
                value={data.secondaryColor}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="h-12 w-full border border-gray-300 rounded mt-1 cursor-pointer"
              />
            </div>
          </div>
  
          {/* FORMATOS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Formatos</h2>
  
            <div>
              <label className="text-gray-600 text-sm">Formato de fecha</label>
              <select
                value={data.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className="w-full mt-1 p-2 rounded border border-gray-300 bg-gray-50 text-gray-800"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
  
            <div>
              <label className="text-gray-600 text-sm">Formato de hora</label>
              <select
                value={data.timeFormat}
                onChange={(e) => handleChange("timeFormat", e.target.value)}
                className="w-full mt-1 p-2 rounded border border-gray-300 bg-gray-50 text-gray-800"
              >
                <option value="HH:mm">24 horas (HH:mm)</option>
                <option value="hh:mm A">12 horas (hh:mm A)</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* BOTONES */}
        <div className="flex gap-4">
          <button
            onClick={saveChanges}
            className="bg-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Save size={18} /> Guardar cambios
          </button>
  
          <button
            onClick={() => setConfirmOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <RefreshCcw size={18} /> Restaurar
          </button>
        </div>
      </section>
  
      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title="Restablecer configuración"
        message="Esto eliminará el logo y devolverá todo a los valores por defecto. ¿Continuar?"
        confirmText="Sí, restaurar"
        cancelText="Cancelar"
        onConfirm={() => {
          setConfirmOpen(false);
          pendingAction && pendingAction();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
  
}
