"use client";

import React, { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  icon: Icon,
  defaultOpen = false,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden shadow-sm transition-all mb-4",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-zinc-900/30 hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100 text-lg">
          {Icon && <Icon size={20} className="text-primary" />}
          {title}
        </div>
        <ChevronDown
          size={20}
          className={cn(
            "text-gray-500 transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
