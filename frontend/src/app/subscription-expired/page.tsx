"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, CreditCard, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestEmergencyAccess } from "../../utils/api"; 
import { useToast } from "../../context/ToastContext";

export default function SubscriptionExpiredPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmergency = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      await requestEmergencyAccess();
      toast.success("¡Acceso de emergencia activado! Tienes 24hs.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      // Mostrar mensaje del backend (ej: cooldown)
      const msg = err.response?.data?.message || err.message || "No se pudo activar la emergencia.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg w-full bg-[#121212] border border-rose-900/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600" />
        
        <div className="p-8 md:p-10 text-center">
            <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-rose-500/20 shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]">
                <Lock className="w-10 h-10 text-rose-500" strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Suscripción Vencida
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Tu periodo de prueba o suscripción ha finalizado. <br/>
                Para continuar disfrutando de todas las herramientas de Controlia, por favor actualiza tu plan.
            </p>

            {/* Primary Action */}
            <Link 
                href="/pricing?expired=true"
                className="block w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] mb-4 flex items-center justify-center gap-2 group"
            >
                <CreditCard className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                Actualizar Plan Ahora
            </Link>

            {/* Emergency Action */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm group-hover:blur opacity-0 group-hover:opacity-100 transition-all" />
                <button
                    onClick={handleEmergency}
                    disabled={loading}
                    className="relative w-full border border-gray-800 hover:border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 hover:text-white py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-pulse">Verificando disponibilidad...</span>
                    ) : (
                        <>
                           <ShieldAlert className="w-4 h-4" />
                           Necesito 1 día de emergencia
                        </>
                    )}
                </button>
            </div>
            
            <p className="text-xs text-gray-600 mt-3 flex items-center justify-center gap-1.5">
                <Clock size={12} />
                El acceso de emergencia solo está disponible cada 30 días.
            </p>
            
            {errorMsg && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-rose-950/20 border border-rose-900/30 rounded-lg flex items-start gap-3 text-left"
                >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-rose-400">Acceso denegado</h4>
                        <p className="text-xs text-rose-300/80 mt-1">
                            {errorMsg}.
                        </p>
                    </div>
                </motion.div>
            )}

        </div>
        
        {/* Footer info */}
        <div className="bg-[#0f0f10] p-4 text-center border-t border-white/5">
             <p className="text-xs text-gray-500">
                ¿Tienes dudas? <a href="#" className="underline hover:text-gray-400">Contáctanos por WhatsApp</a>
             </p>
        </div>

      </motion.div>
    </div>
  );
}
