"use client";

import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import Loading from "../../components/loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🚦 Flag interno para evitar doble render/loop
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loading) return; // Esperar a que termine la carga del contexto

    // Usuario sin sesión → solo redirigir si intenta acceder al dashboard
    if (!isAuthenticated && pathname.startsWith("/dashboard")) {
      // console.log("🔒 No autenticado, redirigiendo a /login");
      router.replace("/login");
      return;
    }

    // Usuario autenticado → si está en login o raíz, mandarlo al dashboard
    if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
      // console.log("✅ Autenticado, redirigiendo al dashboard");
      router.replace("/dashboard");
      return;
    }

    setIsReady(true); // Ya se evaluó correctamente la sesión
  }, [loading, isAuthenticated, pathname, router]);

  // Mientras se verifica o redirige → loader
  if (loading || !isReady) {
    return <Loading fullscreen message="Verificando sesión..." />;
  }

  // Si no está autenticado y no está en dashboard → no renderizar nada
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return null;
  }

  // ✅ Render normal del dashboard
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 p-6 overflow-y-auto"
            id="dashboardContent"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
