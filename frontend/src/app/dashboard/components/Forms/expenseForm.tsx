"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Undo2, CheckCircle2, DollarSign, User, FileText } from "lucide-react";
import { updateDailyCash, getSuppliers } from "../../../../utils/api";
import { useToast } from "../../../../context/ToastContext";

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
  const [amount, setAmount] = useState("");
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

    if (!amount || Number(amount) <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    let finalDescription = description;
    if (type === "supplier") {
      if (!selectedSupplier) {
        toast.error("Selecciona un proveedor");
        return;
      }
      finalDescription = `Pago a Proveedor: ${suppliers.find(s => s._id === selectedSupplier)?.name || "Desconocido"} - ${description}`;
    } else {
      if (!description.trim()) {
        toast.error("Ingresa una descripción");
        return;
      }
    }

    setLoading(true);

    try {
      const newExpense = {
        description: finalDescription,
        amount: Number(amount),
      };

      // Append to existing
      const updatedExpenses = [...(currentExpenses || []), newExpense];

      await updateDailyCash(cashId, {
        extraExpenses: updatedExpenses,
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
      className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
           <h3 className="text-xl font-bold text-gray-800">Registrar Movimiento</h3>
           <p className="text-sm text-gray-500">Gasto diario o pago a proveedor</p>
        </div>
        <button
          onClick={onBack}
          className="p-2 bg-white hover:bg-gray-100 rounded-xl transition shadow-sm border border-gray-200"
        >
          <Undo2 size={20} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* Type Selector */}
        <div className="flex gap-4">
          <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${type === "general" ? "border-rose-500 bg-rose-50 text-rose-700" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}>
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

          <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${type === "supplier" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}>
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
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
            Monto
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <DollarSign size={18} />
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-lg font-medium text-gray-800"
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        {type === "supplier" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Proveedor
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Detalle / Nota (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Pago parcial, Factura A..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Descripción
            </label>
            <input
              type="text"
              placeholder="Ej. Limpieza, Alquiler, Retiro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all flex justify-center items-center gap-2"
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
