"use client";

import { motion } from "framer-motion";

export default function Loading({
  message = "Cargando datos...",
  fullscreen = false,
}: {
  message?: string;
  fullscreen?: boolean;
}) {
  return (
    <div
      suppressHydrationWarning
      className={`flex flex-col items-center justify-center gap-4 text-gray-600 ${
        fullscreen ? "fixed inset-0 bg-gray-200/80 z-50 backdrop-blur-sm" : "py-8"
      }`}
    >
      {/* 🔵 Spinner animado estilo Controlia */}
      <motion.div
        className="relative w-12 h-12"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        <div suppressHydrationWarning className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent" />
      </motion.div>

      {/* Texto animado */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
        className="text-sm font-medium tracking-wide"
      >
        {message}
      </motion.p>

      {/* Firma sutil */}
      <p className="text-[11px] text-gray-400 mt-2">
        Controlia • Sistema de gestión inteligente
      </p>
    </div>
  );
}
