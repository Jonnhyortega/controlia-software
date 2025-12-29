"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onCancel();
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onConfirm();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
      
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, onCancel, onConfirm]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="
              relative bg-zinc-900 border border-zinc-800 
              shadow-2xl rounded-md 
              max-w-sm w-full p-6 text-center overflow-hidden
            "
          >
            {/* Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-red-500/10 blur-3xl -z-10 pointer-events-none" />

            {/* Icono */}
            <div className="flex justify-center mb-5">
              <div className="bg-red-500/10 p-4 rounded-md ring-1 ring-red-500/20">
                <AlertCircle className="text-red-500 w-8 h-8" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-xl font-bold text-white mb-2">
              {title}
            </h2>

            {/* Mensaje */}
            <p className="text-gray-400 mb-8 text-[15px] leading-relaxed">
              {message}
            </p>

            {/* Botones */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCancel}
                className="
                  px-4 py-2.5 rounded-md
                  bg-zinc-800 hover:bg-zinc-700 
                  text-gray-300 font-medium
                  transition border border-zinc-700
                "
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="
                  px-4 py-2.5 rounded-md
                  bg-red-600 hover:bg-red-700 
                  text-white font-semibold
                  transition shadow-lg shadow-red-500/20
                "
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
