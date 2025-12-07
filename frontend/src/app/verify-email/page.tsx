"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { verifyEmail, resendVerificationCode } from "../../utils/api";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutos en segundos

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cargar email desde URL
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Si no hay email, redirigir a login
      router.push("/login");
    }
  }, [searchParams, router]);

  // Countdown para tiempo restante del código
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Countdown para cooldown de reenvío
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    
    // Focus al último input con valor
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Por favor, ingresa el código completo de 6 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await verifyEmail(email, fullCode);
      
      // Auto-login después de verificación exitosa
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));

      toast.success("¡Email verificado correctamente! 🎉");
      
      // Redirigir al dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);

    } catch (err: any) {
      console.error("Error verificando email:", err);
      const errorMsg = err?.response?.data?.message || "Error al verificar el código";
      setError(errorMsg);
      
      // Limpiar código si es inválido
      if (errorMsg.includes("inválido")) {
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }

      // Si el código expiró, resetear el timer
      if (err?.response?.data?.codeExpired) {
        setTimeRemaining(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");

    try {
      await resendVerificationCode(email);
      toast.success("Código reenviado. Revisa tu email 📧");
      setResendCooldown(60); // 60 segundos de cooldown
      setTimeRemaining(15 * 60); // Resetear timer a 15 minutos
      setCode(["", "", "", "", "", ""]); // Limpiar código anterior
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error("Error reenviando código:", err);
      setError(err?.response?.data?.message || "Error al reenviar el código");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#121212] p-8 rounded-2xl border border-gray-800 relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verifica tu email</h1>
          <p className="text-gray-400 text-sm">
            Hemos enviado un código de 6 dígitos a
          </p>
          <p className="text-primary font-medium mt-1">{email}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Inputs de código */}
          <div>
            <label className="block text-sm mb-3 text-center">
              Ingresa el código de verificación
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}                  
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-[#1c1c1c] border-2 border-gray-700 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Timer */}
          {timeRemaining > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Código válido por: {formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Botón verificar */}
          <button
            type="submit"
            disabled={loading || code.join("").length !== 6}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              loading || code.join("").length !== 6
                ? "bg-primary-200 cursor-not-allowed text-primary-700"
                : "bg-primary hover:bg-primary-700 text-white"
            }`}
          >
            {loading ? (
              "Verificando..."
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Verificar código
              </>
            )}
          </button>

          {/* Botón reenviar */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">¿No recibiste el código?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading || resendCooldown > 0}
              className={`text-sm font-medium transition ${
                loading || resendCooldown > 0
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-primary hover:text-primary-400"
              }`}
            >
              {resendCooldown > 0
                ? `Reenviar en ${resendCooldown}s`
                : "Reenviar código"}
            </button>
          </div>
        </form>

        {/* Volver */}
        <button
          onClick={() => router.push("/login")}
          className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </button>
      </motion.div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
