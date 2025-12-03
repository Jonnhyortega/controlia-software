"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed inset-0 z-[999] flex items-center justify-center 
            bg-black/40 backdrop-blur-sm
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="
              bg-white/10 backdrop-blur-xl 
              border border-white/20 
              shadow-2xl rounded-2xl 
              max-w-sm w-[90%] p-6 text-center
            "
          >
            {/* Icono */}
            <div className="flex justify-center mb-3">
              <div className="bg-blue-500/15 p-3 rounded-full">
                <AlertCircle className="text-blue-500 w-8 h-8" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-xl font-semibold text-white mb-2 drop-shadow-sm">
              {title}
            </h2>

            {/* Mensaje */}
            <p className="text-gray-200 mb-6 text-[15px] leading-relaxed">
              {message}
            </p>

            {/* Botones */}
            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="
                  px-4 py-2 rounded-lg
                  bg-white/20 hover:bg-white/30 
                  text-white font-medium
                  transition
                "
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="
                  px-4 py-2 rounded-lg
                  bg-red-600 hover:bg-red-700 
                  text-white font-semibold
                  transition shadow-lg
                "
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
