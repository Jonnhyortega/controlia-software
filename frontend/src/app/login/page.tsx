"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../utils/api";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Eye, EyeOff, Gift, Loader2 } from "lucide-react";

const BRAND_BENEFITS = [
  "Cobrás, controlás el stock y cerrás la caja en un solo lugar",
  "Lector de códigos con la cámara del celular",
  "Los fiados anotados, sin cuaderno",
];

// Componente Reutilizable de Input Flotante
const FloatingInput = ({
  label,
  value,
  onChange,
  name,
  type = "text",
  required = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  autoComplete
}: any) => {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/20 focus-within:border-[#3483fa]/70 focus-within:bg-[#3483fa]/[0.04] focus-within:shadow-[0_0_0_4px_rgba(52,131,250,0.15)] transition-all duration-200">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        autoComplete={autoComplete}
        className={`block w-full !px-4 !pt-7 !pb-2.5 !text-white !bg-transparent !border-0 !rounded-xl outline-none peer leading-normal placeholder-transparent ${showPasswordToggle ? 'pr-10' : ''}`}
      />
      <label
        className={`absolute left-0 w-full px-4 transition-all duration-200 pointer-events-none 
                   peer-focus:top-2 peer-focus:text-right peer-focus:text-[11px] peer-focus:text-[#57b4ff] peer-focus:-translate-y-0
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-left peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2
                   top-2 text-right text-[11px] text-gray-500 -translate-y-0 ${showPasswordToggle ? 'pr-10' : ''}`}
      >
        {label}
      </label>
      {showPasswordToggle && (
        <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
        >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const toast = useToast?.();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    businessName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ==========================================================
  // 🔥 SUBMIT FORMULARIO
  // ==========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const res = await login(formData.email, formData.password);

        if (res.success) {
          toast?.success?.(`Bienvenido ${res.user?.name || ""} 👋`);
          setTimeout(() => router.push("/dashboard"), 150);
        } else if (res.emailNotVerified) {
          setError(
            `${res.message || "Email no verificado"}. Verifica tu cuenta para continuar.`
          );
          if (res.email) {
            sessionStorage.setItem("unverifiedEmail", res.email);
          }
        } else {
          setError(res.message || "Error al iniciar sesión.");
        }

      } else {
        // REGISTRO
        const res = await register(formData);

        if (!res.success) {
          setError(res.message ?? "Ocurrió un error desconocido");
        } else {
          toast?.success?.("Revisa tu email para verificar tu cuenta 📧");
          if (res.email) {
            setTimeout(() => {
              router.push(`/verify-email?email=${encodeURIComponent(res.email!)}`);
            }, 500);
          }
        }
      }
    } catch (err: any) {
      console.error("❌ Error en auth:", err);
      setError(err?.response?.data?.message || "Error procesando la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Init Google Sign-In script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Open register form when ?register=1
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shouldOpenRegister = params.get("register");
    if (shouldOpenRegister === "1" || shouldOpenRegister === "true") {
      setIsLogin(false);
    }
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    if (!clientId) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID no encontrado.");
      return;
    }

    let interval: any = null;

    function handleCredentialResponse(credential: string | undefined) {
      if (!credential) return;
      (async function (id_token: string) {
        try {
          const res = await api.post('/users/google', { id_token });
          const data = res.data;
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
          
          if (data.isNewUser) {
            location.replace('/dashboard?welcome=true');
          } else {
            location.replace('/dashboard');
          }
        } catch (err: any) {
          console.error(err);
          alert(err.response?.data?.message || 'Error autenticando con Google');
        }
      })(credential);
    }

    function tryInit() {
      if ((window as any).google && document.getElementById('gsi-button')) {
        const el = document.getElementById('gsi-button');
        const containerWidth = el?.offsetWidth; // Responsive width

        try {
          (window as any).google.accounts.id.initialize({ client_id: clientId, callback: (resp: any) => handleCredentialResponse(resp?.credential) });
          (window as any).google.accounts.id.renderButton(el, { 
            theme: 'filled_black', 
            size: 'large',
            shape: 'pill',
            width: containerWidth ? containerWidth.toString() : '380',
            text: 'continue_with',
            logo_alignment: 'left'
          });
        } catch (e) {
          console.warn('Error inicializando Google Sign-In', e);
        }
        return true;
      }
      return false;
    }

    if (!tryInit()) {
      interval = setInterval(() => {
        if (tryInit()) {
          clearInterval(interval);
          interval = null;
        }
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative isolate min-h-screen flex overflow-clip bg-[#07090d] text-white">
      {/* Fondo: grilla técnica + auroras */}
      <div className="absolute inset-0 -z-10 lp-grid" />
      <div className="lp-aurora lp-aurora--blue -z-10 top-[-20%] left-[-10%] w-[700px] h-[600px]" />
      <div className="lp-aurora lp-aurora--violet -z-10 bottom-[-25%] right-[-10%] w-[700px] h-[600px] opacity-40" />
      <div className="lp-aurora lp-aurora--cyan -z-10 top-[40%] left-[35%] w-[400px] h-[300px] opacity-20" />

      {/* Panel de marca (desktop) */}
      <aside className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 border-r border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <img src="/icon.png" alt="Controlia" className="h-8 w-8 rounded-md" />
          <span className="text-xl font-bold tracking-tight font-funnel-display lp-text-metal">CONTROLIA</span>
        </Link>

        <div className="max-w-lg">
          <h2 className="text-5xl xl:text-6xl font-extrabold leading-[1.05] tracking-[-0.03em] mb-6">
            <span className="lp-text-metal">Tu negocio,</span>
            <br />
            <span className="lp-text-gradient">bajo control.</span>
          </h2>
          <ul className="space-y-3 mb-10">
            {BRAND_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-gray-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/25 to-emerald-600/10 ring-1 ring-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="lp-float lp-border-glow relative max-w-sm rounded-xl border border-white/10 bg-[#07090d]/60 backdrop-blur-xl p-4 flex items-center gap-4 shadow-[0_20px_60px_-15px_rgba(52,131,250,0.45)]">
            <div className="bg-gradient-to-br from-emerald-400/30 to-emerald-600/10 ring-1 ring-emerald-400/30 p-2 rounded-md">
              <BarChart3 className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Ventas hoy</p>
              <p className="text-green-400 font-mono text-xs">+24% vs ayer</p>
            </div>
            <div className="ml-auto font-bold text-lg font-mono tabular-nums lp-text-metal">$145.200</div>
          </div>
        </div>

        <p className="text-xs text-gray-500">© Controlia · Sistema de gestión para comercios</p>
      </aside>

      {/* Panel del formulario */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <img src="/icon.png" alt="Controlia" className="h-8 w-8 rounded-md" />
              <span className="text-lg font-bold tracking-tight font-funnel-display lp-text-metal">CONTROLIA</span>
            </Link>
            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>

          <div className="lp-border-glow relative flex flex-col gap-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-[-0.025em] mb-2 lp-text-metal">
                {isLogin ? "¡Hola de nuevo!" : "Crear cuenta"}
              </h1>
              <p className="text-gray-400 text-sm">
                {isLogin
                  ? "Ingresá tus datos para entrar a tu panel."
                  : "Creá tu cuenta y probá Controlia 15 días gratis."}
              </p>
            </div>

            {/* Toggle */}
            <div className="relative flex rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10">
              <motion.div
                className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] rounded-full lp-btn-primary"
                animate={{ x: isLogin ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-medium transition-colors ${
                  isLogin ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-medium transition-colors ${
                  !isLogin ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Formularios */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                // 🔹 LOGIN FORM
                <motion.form
                  key="login"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div className="space-y-4">
                    <FloatingInput
                      label="Correo Electrónico"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      required
                      autoComplete="email"
                    />

                    <div>
                      <FloatingInput
                        label="Contraseña"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        required
                        showPasswordToggle={true}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        autoComplete="current-password"
                      />
                      <div className="flex justify-end mt-2">
                        <Link
                          href="/forgot-password"
                          className="text-xs text-gray-400 hover:text-[#57b4ff] transition-colors font-medium"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="space-y-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      <p className="text-red-400 text-sm font-medium">{error}</p>
                      {error.includes("verifica") && sessionStorage.getItem("unverifiedEmail") && (
                        <button
                          type="button"
                          onClick={() => {
                            const email = sessionStorage.getItem("unverifiedEmail");
                            if (email) {
                              router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                            }
                          }}
                          className="text-white text-xs font-semibold hover:underline"
                        >
                          Verificar ahora
                        </button>
                      )}
                    </div>
                  )}

                  <SubmitButton loading={loading} label="Ingresar" loadingLabel="Iniciando..." />
                </motion.form>
              ) : (
                // 🔹 REGISTER FORM
                <motion.form
                  key="register"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {/* 🎁 Alerta de Prueba Gratuita */}
                  <div className="relative overflow-hidden rounded-xl border border-[#3483fa]/30 bg-gradient-to-r from-[#3483fa]/[0.15] via-[#6d5dfc]/[0.08] to-transparent p-4 flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg lp-btn-primary">
                      <Gift className="w-4 h-4 text-white" />
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">Prueba gratis de 15 días</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Usá el Plan Base sin costo. Después, $25.000 ARS/mes.
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">No se requiere tarjeta de crédito</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FloatingInput
                      label="Nombre de tu Negocio"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      autoComplete="organization"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="given-name"
                      />
                      <FloatingInput
                        label="Apellido"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        autoComplete="family-name"
                      />
                    </div>

                    <FloatingInput
                      label="Correo Electrónico"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      required
                      autoComplete="email"
                    />

                    <FloatingInput
                      label="Contraseña"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      required
                      showPasswordToggle={true}
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                      autoComplete="new-password"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>
                  )}

                  <SubmitButton loading={loading} label="Crear cuenta" loadingLabel="Registrando..." />
                </motion.form>
              )}
            </AnimatePresence>

            {/* Google SIEMPRE VISIBLE */}
            <div className="text-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">O continúa con</p>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
              </div>
              <div id="gsi-button" className="flex items-center justify-center w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="lp-btn-primary lp-shine group w-full h-12 mt-1 rounded-full font-semibold text-sm text-white inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}
