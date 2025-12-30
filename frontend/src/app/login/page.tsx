"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../utils/api";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="relative bg-[#1c1c1c] rounded-md border border-gray-800 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        autoComplete={autoComplete}
        className={`block w-full px-4 pt-8 pb-3 text-white bg-transparent rounded-md outline-none peer leading-normal placeholder-transparent ${showPasswordToggle ? 'pr-10' : ''}`}
      />
      <label
        className={`absolute left-0 w-full px-4 transition-all duration-200 pointer-events-none 
                   peer-focus:top-2 peer-focus:text-right peer-focus:text-[11px] peer-focus:text-primary peer-focus:-translate-y-0
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
        try {
          (window as any).google.accounts.id.initialize({ client_id: clientId, callback: (resp: any) => handleCredentialResponse(resp?.credential) });
          (window as any).google.accounts.id.renderButton(el, { 
            theme: 'filled_black', 
            size: 'large',
            shape: 'pill',
            width: '380',
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

  // Mouse interactive background logic
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-white px-4 py-8">
      
      {/* 🔮 Interactive Background Layers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        
        {/* Shape 1 - Top Left (Primary) */}
        <motion.div 
          animate={{
            x: mousePosition.x * -0.05,
            y: mousePosition.y * -0.05,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary/60 rounded-full blur-[120px] opacity-70 mix-blend-screen"
        />

        {/* Shape 2 - Bottom Right (Secondary/Accent) */}
        <motion.div 
           animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
          className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-indigo-600/50 rounded-full blur-[140px] opacity-70 mix-blend-screen"
        />

        {/* Shape 3 - Center (Subtle) */}
        <motion.div 
           animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.8 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] opacity-50 rotate-12 mix-blend-screen"
        />

      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-12 backdrop-blur-sm">
        
        {/* Panel derecho (Central) */}
        <div className="w-full max-w-md flex flex-col gap-6 bg-[#121212]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 relative shadow-2xl ring-1 ring-white/5">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-xs tracking-[0.4em] font-bold text-gray-500 mb-4 uppercase">
              Controlia
            </h1>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {isLogin ? "¡Hola de nuevo!" : "Crear cuenta"}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin
                ? "Ingresa tus datos para acceder al panel."
                : "Registrate en segundos y administra tu negocio."}
            </p>
          </div>

          {/* Toggle */}
          <div className="relative flex bg-[#1c1c1c] p-1 rounded-md">
            <motion.div
              className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-md shadow-lg"
              animate={{ x: isLogin ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-2.5 text-sm font-medium transition ${
                isLogin ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-2.5 text-sm font-medium transition ${
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
                <div className="space-y-5">
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
                            className="text-xs text-gray-500 hover:text-primary transition-colors font-medium cursor-pointer"
                            >
                            ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>
                </div>

                {error && (
                  <div className="space-y-2 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 mt-2 rounded-md font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] ${
                    loading
                      ? "bg-primary/20 text-primary-300 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-primary/30"
                  }`}
                >
                  {loading ? "INICIANDO..." : "INGRESAR"}
                </button>
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
                <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 rounded-md p-4">
                    <p className="font-bold text-primary-300 text-sm mb-1">🎁 Prueba Gratis de 15 días</p>
                    <p className="text-xs text-gray-400">
                      Disfruta del Plan Base sin costo. Luego $25.000 ARS/mes.  
                    </p>
                    <small className="text-xs text-gray-600 w-full text-right">No se requiere tarjeta de credito</small>
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
                  <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-md border border-red-500/20">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 mt-2 rounded-md font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] ${
                    loading
                      ? "bg-primary/20 text-primary-300 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-primary/30"
                  }`}
                >
                  {loading ? "REGISTRANDO..." : "CREAR CUENTA"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

            {/* Google SIEMPRE VISIBLE */}
            <div className="pt-4 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">O continúa con</p>
              <div id="gsi-button" className="flex items-center justify-center w-full" />
            </div>
        </div>
      </div>
    </section>
  );
}
