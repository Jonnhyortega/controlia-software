"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading({
  message = "Cargando Controlia...",
  fullscreen = false,
  size = 64, // Default size for the spinner
}: {
  message?: string;
  fullscreen?: boolean;
  size?: number;
}) {
  return (
    <div
      suppressHydrationWarning
      className={`flex flex-col items-center justify-center gap-6 text-foreground ${
        fullscreen
          ? "fixed inset-0 bg-background/80 z-50 backdrop-blur-md"
          : "w-full h-full min-h-[200px]"
      }`}
    >
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* 🏢 Logo Central */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-[50%] h-[50%]">
             <Image
               src="/icon.png"
               alt="Controlia Logo"
               fill
               className="object-contain"
               priority
             />
          </div>
        </div>

        {/* ⭕ Anillo de fondo sutil */}
        <svg
          className="absolute inset-0 w-full h-full rotate-[-90deg]"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/10"
          />
        </svg>

        {/* 🌀 Spinner animado (Barra circular) */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible animate-spin"
          viewBox="0 0 100 100"
        >
           <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor" // Or url(#spinner-gradient) for cooler effect
            strokeWidth="3"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray="180 251.2" // ~70% filled
            // Optional: Animate dasharray for "breathing" circle
          />
        </svg>
      </div>

      {/* 📜 Texto animado opcional */}
      {message && (
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="flex flex-col items-center gap-1"
        >
          <p className="text-sm font-medium tracking-wide text-muted-foreground animate-pulse">
            {message}
          </p>
        </motion.div>
      )}
    </div>
  );
}
