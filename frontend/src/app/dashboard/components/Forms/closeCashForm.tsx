"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertTriangle, X } from "lucide-react";
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
      className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-zinc-800 shadow-2xl rounded-xl p-0 max-w-md mx-auto relative overflow-hidden transition-all"
    >
      {/* HEADER */}
      <div className="flex items-center gap-5 p-6 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
        <div className="p-3.5 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 rounded-md shadow-lg shadow-amber-500/20 transform hover:scale-105 transition-transform duration-300">
           <Lock className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Cerrar Caja</h3>
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Finalizar jornada laboral</p>
        </div>

        <button
          onClick={onBack}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-md p-4 flex gap-3 text-amber-800 dark:text-amber-200">
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
          className="bg-gray-900 hover:bg-black dark:bg-primary dark:hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-md w-full transition shadow-lg flex justify-center"
        >
          {loading ? "Cerrando..." : "Confirmar Cierre"}
        </button>
      </form>
      </div>
    </motion.div>
  );
}
