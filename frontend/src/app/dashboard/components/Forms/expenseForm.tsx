"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, DollarSign, User, FileText, Upload } from "lucide-react";
import { updateDailyCash, getSuppliers } from "../../../../utils/api";
import { createTransaction } from "../../../../utils/transactions";
import { useToast } from "../../../../context/ToastContext";
import { useCustomization } from "../../../../context/CustomizationContext";

import { FormattedPriceInput } from "../../../../components/FormattedPriceInput";
import SupplierSearch from "./SupplierSearch";

interface ExpenseFormProps {
  cashId: string;
  currentExpenses: { description: string; amount: number }[];
  onBack: () => void;
  onCreated: () => void;
}

export default function ExpenseForm({
  cashId,
  currentExpenses,
  onBack,
  onCreated,
}: ExpenseFormProps) {
  const toast = useToast();
  const { formatCurrency } = useCustomization();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  // Form State
  const [type, setType] = useState<"general" | "supplier">("general");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Load suppliers
  useEffect(() => {
    getSuppliers()
      .then((data) => setSuppliers(data))
      .catch((err) => console.error("Error cargando proveedores", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!amount || amount <= 0) {
      toast.error("Ingresa un monto válido");
      setLoading(false);
      return;
    }

    let finalDescription = description;
    if (type === "supplier") {
      if (!selectedSupplier) {
        toast.error("Selecciona un proveedor");
        setLoading(false);
        return;
      }
      finalDescription = `Pago a Proveedor: ${suppliers.find(s => s._id === selectedSupplier)?.name || "Desconocido"} - ${description}`;
    } else {
      if (!description.trim()) {
        toast.error("Ingresa una descripción");
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Si es pago a proveedor, creamos la TRANSACCIÓN (impacta deuda/historial)
      // 1. Si es pago a proveedor, creamos la TRANSACCIÓN (impacta deuda/historial)
      if (type === "supplier") {
         const transactionData = new FormData();
         transactionData.append("type", "SUPPLIER_PAYMENT");
         transactionData.append("amount", amount.toString());
         transactionData.append("supplierId", selectedSupplier);
         transactionData.append("description", description || "Pago desde caja diaria");
         transactionData.append("date", new Date().toISOString());
         
         if (file) {
            transactionData.append("image", file);
         }

         await createTransaction(transactionData);
      }

      // 2. Registramos la salida en la CAJA DIARIA (impacta efectivo en mano)
      const newExpense = {
        description: finalDescription,
        amount: Number(amount),
      };

      await updateDailyCash(cashId, {
        extraExpenses: [newExpense],
      });

      toast.success("Movimiento registrado correctamente");
      onCreated();
    } catch (error: any) {
      console.error(error);
      toast.error("Error al registrar el movimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-5 p-6 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 relative">
        <div className="p-3.5 bg-primary dark:bg-primary rounded-md shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform duration-300">
           <DollarSign className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Registrar Salida</h3>
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Gasto o pago a proveedor</p>
        </div>
        <button
          onClick={onBack}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 dark:bg-background bg-white ">
        
        {/* Type Selector */}
        <div className="flex gap-4">
          <label className={`flex-1 cursor-pointer border rounded-md p-4 flex flex-col items-center gap-3 transition-all ${type === "general" ? "border-rose-500 bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 shadow-sm" : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"}`}>
            <input 
              type="radio" 
              name="type" 
              value="general" 
              checked={type === "general"} 
              onChange={() => setType("general")} 
              className="hidden" 
            />
            <FileText size={20} />
            <span className="font-semibold text-sm">Gasto General</span>
          </label>

          <label className={`flex-1 cursor-pointer border rounded-md p-4 flex flex-col items-center gap-3 transition-all ${type === "supplier" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 shadow-sm" : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"}`}>
            <input 
              type="radio" 
              name="type" 
              value="supplier" 
              checked={type === "supplier"} 
              onChange={() => setType("supplier")} 
              className="hidden" 
            />
            <User size={20} />
            <span className="font-semibold text-sm">Pago a Proveedor</span>
          </label>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
            Monto
          </label>
          <FormattedPriceInput
            value={amount}
            onChange={(e: any) => setAmount(Number(e.target.value))}
            name={""}          />
        </div>

        {/* Dynamic Fields */}
        {type === "supplier" ? (
          <div className="space-y-5">
            <div>
                 <SupplierSearch 
                    suppliers={suppliers}
                    selectedSupplierId={selectedSupplier}
                    onSelect={(s) => setSelectedSupplier(s ? s._id : "")}
                 />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Detalle / Nota
              </label>
              <input
                type="text"
                placeholder="Ej. Pago parcial, Factura A..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-medium"
              />
            </div>

            <div>
                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Comprobante (Opcional)</label>
                 <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700/50 rounded-md p-4 text-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition cursor-pointer relative group">
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    
                    {previewUrl ? (
                        <div className="flex flex-col items-center relative">
                            <img src={previewUrl} alt="Preview" className="h-24 object-contain rounded-md mb-2 shadow-sm" />
                            <p className="text-xs text-primary font-medium">Clic para cambiar</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm font-medium">Subir imagen o PDF</span>
                        </div>
                    )}
                 </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
              Descripción
            </label>
            <input
              type="text"
              placeholder="Ej. Limpieza, Alquiler, Retiro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-medium"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-700 text-white py-3.5 rounded-md font-bold shadow-lg shadow-gray-200 dark:shadow-none active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">Guardando...</span>
          ) : (
            <>
              <CheckCircle2 size={20} />
              Registrar Movimiento
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
