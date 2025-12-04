"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useEffect } from "react";
import { useToast } from "../../context/ToastContext"; // 👈 opcional si usás toasts globales
import { api } from "../../utils/api";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();   // 👈 AHORA TENÉS REGISTER
  const toast = useToast?.();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
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
        } else {
          setError(res.message || "Error al iniciar sesión.");
        }

      } else {
        // REGISTRO
        const res = await register(formData);

        if (!res.success) {
          setError(res.message ?? "Ocurrió un error desconocido");
        } else {
          toast?.success?.("Cuenta creada correctamente. Iniciá sesión.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error("❌ Error en auth:", err);
      setError(err?.response?.data?.message || "Error procesando la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Init Google Sign-In script (client-side)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Carga la librería si no existe
    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Open register form when ?register=1 is present in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shouldOpenRegister = params.get("register");
    if (shouldOpenRegister === "1" || shouldOpenRegister === "true") {
      setIsLogin(false);
    }
  }, []);

  // Initialize Google Sign-In client and render the button reliably
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    if (!clientId) {
      // no client configured; nothing to do
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID no encontrado. Google Sign-In deshabilitado.");
      return;
    }

    let interval: any = null;

    function handleCredentialResponse(credential: string | undefined) {
      if (!credential) return;
      // callback that mirrors the previous inline script behaviour
      (async function (id_token: string) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token })
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
            location.replace('/dashboard');
          } else {
            alert(data?.message || 'Error autenticando con Google');
          }
        } catch (err) {
          console.error(err);
        }
      })(credential);
    }

    function tryInit() {
      if ((window as any).google && document.getElementById('gsi-button')) {
        const el = document.getElementById('gsi-button');
        try {
          (window as any).google.accounts.id.initialize({ client_id: clientId, callback: (resp: any) => handleCredentialResponse(resp?.credential) });
          (window as any).google.accounts.id.renderButton(el, { theme: 'outline', size: 'large' });
        } catch (e) {
          console.warn('Error inicializando Google Sign-In', e);
        }
        return true;
      }
      return false;
    }

    // if script already there, try init; otherwise try repeatedly until loaded
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

  // ==========================================================
  // 🔹 Render principal
  // ==========================================================
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between">
        {/* Imagen izquierda (opcional) */}
        <div className="hidden md:block w-1/2">
          {/* <Image src="/login-dashboard-preview.png" width={500} height={500} alt="Preview" /> */}
        </div>

        {/* Panel derecho */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-[#121212] p-8 rounded-2xl border border-gray-800 relative overflow-hidden">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-sm tracking-[0.3em] text-gray-400 mb-2">
              CONTROLIA
            </h1>
            <h2 className="text-2xl font-bold">
              {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin
                ? "Accedé a tu panel de gestión y mantené el control de tu negocio."
                : "Registrate para empezar a usar el sistema de gestión."}
            </p>
          </div>

          {/* Toggle */}
          <div className="relative flex bg-[#1c1c1c] rounded-lg overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full w-1/2 bg-primary rounded-lg"
              animate={{ x: isLogin ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative z-10 w-1/2 py-2 font-semibold transition ${
                isLogin ? "text-white" : "text-gray-400"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative z-10 w-1/2 py-2 font-semibold transition ${
                !isLogin ? "text-white" : "text-gray-400"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Formularios */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              // 🔹 LOGIN FORM
              <motion.form
                key="login"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg app-input"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg app-input"
                    placeholder="********"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 mt-2 rounded-lg font-semibold transition ${
                    loading
                      ? "bg-primary-200 cursor-not-allowed text-primary-700"
                      : "bg-primary hover:bg-primary-700 text-white"
                  }`}
                >
                  {loading ? "Procesando..." : "Iniciar sesión"}
                </button>

                {/* NOTE: el botón de Google estaba dentro del formulario de login
                    y desaparecía cuando se cambiaba a registro. Lo movemos fuera
                    del formulario condicional para que esté siempre disponible. */}
              </motion.form>
            ) : (
              // 🔹 REGISTER FORM
              <motion.form
                key="register"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg app-input"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg app-input"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg app-input"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg app-input"
                    placeholder="********"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 mt-2 rounded-lg font-semibold transition ${
                    loading
                      ? "bg-primary-200 cursor-not-allowed text-primary-700"
                      : "bg-primary hover:bg-primary-700 text-white"
                  }`}
                >
                  {loading ? "Creando cuenta..." : "Registrarme"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

            {/* Google Sign-In - siempre visible (login o registro) */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400 mb-2">O continuar con</p>
              <div id="gsi-button" className="flex items-center justify-center" />
            </div>
        </div>
      </div>
    </section>
  );
}
