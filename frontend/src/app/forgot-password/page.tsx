"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { api } from "../../utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      // NOTE: This endpoint may not exist yet in the backend.
      // We are implementing the UI ahead of the backend deployment.
      await api.post("/users/forgot-password", { email });
      setStatus("success");
      setMessage("Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
    } catch (error: any) {
      // For security, it's often better to show the same success message even if email not found,
      // but for this MVP we might get specific errors.
      console.error(error);
      if (error.response?.status === 404) {
        setStatus("error");
        setMessage("No encontramos una cuenta con este correo electrónico.");
      } else {
         // Fallback for missing endpoint or other errors
         // If endpoint is missing (404 on the route), we might want to fake success or show detailed error?
         // User backend prompt will implement this soon.
         if (error.response?.status === 404 && error.response.config.url.includes("forgot-password")) {
            // Mock success if backend isn't ready, to show UI to user?
            // No, user specifically asked to fix backend. 
            // I'll show error.
            setStatus("error");
            setMessage("Error de conexión o funcionalidad no disponible aún.");
         } else {
            setStatus("error");
            setMessage(error.response?.data?.message || "Ocurrió un error. Intenta nuevamente.");
         }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
        
        <div className="mb-6">
            <Link href="/login" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                <ArrowLeft size={16} /> Volver al login
            </Link>
        </div>

        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Mail size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Recuperar contraseña</h1>
            <p className="text-gray-400 text-sm">
                Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>
        </div>

        {status === "success" ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <p className="text-green-400 text-sm font-medium">{message}</p>
                <Link href="/login" className="block mt-4 text-primary hover:text-primary-300 text-sm font-semibold">
                    Volver al inicio de sesión
                </Link>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                {status === "error" && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 text-center">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                        loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-700 shadow-lg shadow-primary/20"
                    }`}
                >
                    {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>
            </form>
        )}

      </div>
    </div>
  );
}
