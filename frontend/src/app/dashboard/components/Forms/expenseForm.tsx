"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, DollarSign, User, FileText } from "lucide-react";
import { updateDailyCash, getSuppliers, createTransaction } from "../../../../utils/api";
import { useToast } from "../../../../context/ToastContext";

import { FormattedPriceInput } from "../../../../components/FormattedPriceInput";

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
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  // Form State
  const [type, setType] = useState<"general" | "supplier">("general");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

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
      if (type === "supplier") {
         await createTransaction({
            type: "SUPPLIER_PAYMENT",
            amount: Number(amount),
            supplierId: selectedSupplier,
            description: description || "Pago desde caja diaria",
            date: new Date(),
         });
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
      className="w-full max-w-lg rounded-md shadow-xl overflow-hidden border border-gray-100 dark:border-border"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white dark:from-background dark:to-background px-6 py-4 border-b border-gray-100 dark:border-border flex justify-between items-center">
        <div>
           <h3 className="text-xl font-bold text-gray-800 dark:text-white">Registrar Movimiento</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Gasto diario o pago a proveedor</p>
        </div>
        <button
          onClick={onBack}
          className="p-2 bg-white dark:bg-muted/10 hover:bg-gray-100 dark:hover:bg-muted/20 rounded-md transition shadow-sm border border-gray-200 dark:border-border"
        >
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 dark:bg-background bg-white ">
        
        {/* Type Selector */}
        <div className="flex gap-4">
          <label className={`flex-1 cursor-pointer border-2 rounded-md p-3 flex flex-col items-center gap-2 transition-all ${type === "general" ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400"}`}>
            <input 
              type="radio" 
              name="type" 
              value="general" 
              checked={type === "general"} 
              onChange={() => setType("general")} 
              className="hidden" 
            />
            <FileText size={24} />
            <span className="font-medium text-sm">Gasto General</span>
          </label>

          <label className={`flex-1 cursor-pointer border-2 rounded-md p-3 flex flex-col items-center gap-2 transition-all ${type === "supplier" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400"}`}>
            <input 
              type="radio" 
              name="type" 
              value="supplier" 
              checked={type === "supplier"} 
              onChange={() => setType("supplier")} 
              className="hidden" 
            />
            <User size={24} />
            <span className="font-medium text-sm">Pago Proveedor</span>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Proveedor
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-4 py-3 bg-gray-200 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 outline-none transition text-gray-900 dark:text-white"
              >
                <option value="">Seleccionar proveedor...</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Detalle / Nota (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Pago parcial, Factura A..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-200 dark:bg-muted/10 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 outline-none transition text-gray-900 dark:text-white"
              />
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
              className="w-full px-4 py-3 bg-gray-200 dark:bg-muted/10 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 outline-none transition text-gray-900 dark:text-white"
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
