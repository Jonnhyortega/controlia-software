"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface OverlayNotificationProps {
  type: "success" | "error";
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function OverlayNotification({
  type,
  message,
  show,
  onClose,
}: OverlayNotificationProps) {
  // cierra automático a los 2.5 seg
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // 🔥 ejecuta el cierre del overlay
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={()=>{onClose()}}
          className={`fixed inset-0 h-full z-[9999] flex items-center justify-center backdrop-blur-sm ${
            type === "success"
              ? ""
              : ""
          }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className={`border-2 rounded-md px-10 py-6 text-center shadow-xl font-mono text-lg tracking-wide ${
              type === "success"
                ? "border-green-400 text-green-200 bg-green-900/70"
                : "border-red-400 text-red-200 bg-red-900/70"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-bold">
                {type === "success" ? "✅ Éxito" : "⚠️ Error"}
              </span>
              <p>{message}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
