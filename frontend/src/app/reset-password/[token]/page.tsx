"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "../../../utils/api";
import { use } from "react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const token = resolvedParams.token;
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await api.put(`/users/reset-password/${token}`, { password });
      setStatus("success");
      setMessage("¡Tu contraseña ha sido actualizada correctamente!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error.response?.data?.message || "El enlace es inválido o ha expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#1f1f1f] rounded-md p-8 shadow-2xl">
        
        <div className="text-center mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                status === "success" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
            }`}>
                {status === "success" ? <CheckCircle size={24} /> : <Lock size={24} />}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Restablecer contraseña</h1>
            <p className="text-gray-400 text-sm">
               {status === "success" 
                 ? "Ya puedes iniciar sesión con tu nueva clave."
                 : "Ingresa tu nueva contraseña a continuación."}
            </p>
        </div>

        {status === "success" ? (
             <Link href="/login" className="w-full bg-primary hover:bg-primary-700 text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition-all">
                Ir al Login <ArrowRight size={18} />
             </Link>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nueva contraseña
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2c2c2c] rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2c2c2c] rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                {status === "error" && (
                    <div className="space-y-3">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{message}</p>
                        </div>
                        
                        {/* Si el token es inválido/expirado, ofrecer reintentar */}
                        {(message.toLowerCase().includes("expirado") || message.toLowerCase().includes("inválido") || message.toLowerCase().includes("route")) && (
                            <Link 
                                href="/forgot-password"
                                className="block w-full text-center text-sm text-primary hover:text-primary-300 transition-colors"
                            >
                                Solicitar un nuevo enlace →
                            </Link>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-md font-semibold text-white transition-all ${
                        loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-700 shadow-lg shadow-primary/20"
                    }`}
                >
                    {loading ? "Actualizando..." : "Cambiar contraseña"}
                </button>
            </form>
        )}

      </div>
    </div>
  );
}
