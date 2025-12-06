"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Undo2, Lock, AlertTriangle } from "lucide-react";
import { closeDailyCashById } from "../../../../utils/api";
import { useToast } from "../../../../context/ToastContext";

interface CloseCashFormProps {
  cashId: string;
  onBack: () => void;
  onClosed?: () => void;
}

export default function CloseCashForm({
  cashId,
  onBack,
  onClosed,
}: CloseCashFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send empty arrays as we don't add expenses here anymore
      const res = await closeDailyCashById(cashId, {
        extraExpenses: [],
        supplierPayments: [],
      });

      if (res.success) {
        toast.success(res.message || "Caja cerrada correctamente.");
        if (onClosed) onClosed();
      } else {
        toast.error(res.message || "Error al cerrar la caja.");
      }
      
    } catch (err: any) {
      console.error("❌ Error al cerrar caja:", err);
      toast.error(err.response?.data?.message || err.message || "Error desconocido al intentar cerrar caja.");
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
      className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
           <Lock className="text-gray-700" size={24} />
           Cerrar caja del día
        </h3>

        <button
          onClick={onBack}
          className="p-2 border rounded-lg hover:bg-gray-100 transition"
        >
          <Undo2 size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
           <AlertTriangle className="shrink-0" size={24} />
           <p className="text-sm">
             ¿Estás seguro de que deseas cerrar la caja? 
             <br />
             Una vez cerrada, no podrás registrar más ventas hasta abrir una nueva.
           </p>
        </div>

        {/* ---------------- BOTÓN SUBMIT ---------------- */}
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl w-full transition shadow-lg flex justify-center"
        >
          {loading ? "Cerrando..." : "Confirmar Cierre"}
        </button>
      </form>
    </motion.div>
  );
}
