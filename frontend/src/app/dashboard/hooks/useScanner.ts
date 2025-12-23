"use client";
import { useEffect, useState, useRef } from "react";

/**
 * Hook para manejar tanto escaner físico (Teclado/USB) como visual (Cámara).
 */
export function useScanner(onDetected: (code: string) => void, allowInsideInputs: boolean = false) {
  // Estado para el modal visual (cámara web)
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // ----------- LÓGICA PISTOLA USB (TECLADO) -----------
  const buffer = useRef("");
  const lastKeyTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // 1. Ignorar si el usuario está escribiendo en un input real
        const target = e.target as HTMLElement;
        const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        
        if (isInput && !allowInsideInputs) return;

        const now = Date.now();
        const timeDiff = now - lastKeyTime.current;

        // 2. Si pasó mucho tiempo (>100ms) entre teclas, reseteamos buffer.
        // Las pistolas USB mandan teclas casi instantáneas (<20ms).
        // El tipeo humano es lento (>100ms).
        if (timeDiff > 100) {
            buffer.current = "";
        }
        lastKeyTime.current = now;

        // 3. Detectar ENTER como fin de código
        if (e.key === "Enter") {
            if (buffer.current.length > 2) { // Mínimo 3 caracteres para considerar código válido
                e.preventDefault(); 
                e.stopPropagation(); // Evitar que el Enter active botones con foco
                
                // Disparamos el callback con el código limpio
                const scannedCode = buffer.current;
                buffer.current = ""; // Limpiar inmediato
                onDetected(scannedCode);
            }
            // Si fue un Enter suelto (buffer vacío), lo dejamos pasar (ej: navegación normal)
        } else if (e.key && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            // 4. Acumular caracteres imprimibles
            buffer.current += e.key;
        }
    };

    window.addEventListener("keydown", handleKeyDown, true); // true = capture phase para ganar prioridad
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onDetected]);

  return {
    isCameraOpen,
    openCamera: () => setIsCameraOpen(true),
    closeCamera: () => setIsCameraOpen(false),
  };
}
