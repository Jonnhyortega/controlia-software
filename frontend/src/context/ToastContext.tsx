"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ==========================
// 🔹 PROVIDER
// ==========================
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 🟢 Mostrar Toast (genérico)
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Métodos rápidos
  const toast = {
    success: (msg: string) => showToast("success", msg),
    error: (msg: string) => showToast("error", msg),
    info: (msg: string) => showToast("info", msg),
  };

  // ==========================
  // 💡 Render visual de los toasts
  // ==========================
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 border px-4 py-3 rounded-xl shadow-md ${
                t.type === "success"
                  ? "bg-green-50 border-green-400 text-green-800"
                  : t.type === "error"
                  ? "bg-red-50 border-red-400 text-red-800"
                  : "bg-primary-50 border-primary-300 text-primary-800"
              }`}
            >
              {t.type === "success" ? (
                <CheckCircle className="text-green-600 w-5 h-5 flex-shrink-0" />
              ) : t.type === "error" ? (
                <XCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
              ) : (
                <Info className="text-primary w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ==========================
// 🔹 HOOK PARA USAR TOAST
// ==========================
export const useToast = (): ToastContextType["toast"] => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx.toast;
};
