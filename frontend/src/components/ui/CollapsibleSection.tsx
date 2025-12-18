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
  open?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  icon: Icon,
  defaultOpen = false,
  open,
  onToggle,
  className,
}: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!isOpen);
    } else {
      setInternalOpen(!isOpen);
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-background border border-gray-200 dark:border-border rounded-md overflow-hidden shadow-sm transition-all mb-4",
        className
      )}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-200 hover:bg-gray-100 dark:bg-background dark:hover:bg-muted/10 transition-colors font-semibold text-gray-800 dark:text-gray-200"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-300",
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
