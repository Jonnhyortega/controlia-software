"use client";

import React, { useState } from "react";
import { Lock, Plus } from "lucide-react";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";

interface LimitAwareButtonProps {
  isLimitReached: boolean;
  onClick: () => void;
  label: string;
  limitMessage?: string;
  className?: string; // Allow overriding styles
}

export function LimitAwareButton({
  isLimitReached,
  onClick,
  label,
  limitMessage = "Has alcanzado el límite de tu plan. Actualiza para continuar 🚀",
  className,
}: LimitAwareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <Button
        onClick={() => {
          if (isLimitReached) return;
          onClick();
        }}
        onMouseEnter={() => isLimitReached && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={isLimitReached}
        variant={isLimitReached ? "secondary" : "default"}
        className={`rounded-md px-4 py-2 flex items-center justify-center gap-2 font-bold shadow-md transition-all ${
          isLimitReached
            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 dark:border-zinc-700"
            : "bg-primary hover:bg-primary-700 text-white"
        } ${className || ""}`}
      >
        {isLimitReached ? <Lock size={18} /> : <Plus size={20} />}
        <span>{isLimitReached ? "Límite Alcanzado" : label}</span>
      </Button>

      {/* Custom Tooltip */}
      <AnimatePresence>
        {isLimitReached && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs text-center rounded-md shadow-xl z-50 pointer-events-none"
          >
            {limitMessage}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
