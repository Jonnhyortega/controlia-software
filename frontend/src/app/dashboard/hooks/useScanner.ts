"use client";
import { useState } from "react";

export function useScanner(onDetected: (code: string) => void) {
  const [open, setOpen] = useState(false);

  return {
    open,
    show: () => setOpen(true),
    hide: () => setOpen(false),

    handleDetected: (code: string) => {
      onDetected(code);
      setOpen(false);
    }
  };
}
