"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { X, Camera, RefreshCw } from "lucide-react";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Ref para controlar la instancia del lector y poder detenerlo
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        setLoading(true);
        // Solicitar permisos explícitamente primero para manejar errores mejor
        // await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        
        // decodeFromVideoDevice(deviceId, videoElement, callback)
        // undefined deviceId selecciona la cámara por defecto (trasera preferiblemente si facingMode se respeta automágicamente o por defecto)
        // @zxing/browser maneja esto.
        
        controlsRef.current = await codeReader.decodeFromVideoDevice(
          undefined, 
          videoRef.current!, 
          (result, err) => {
            if (result && mounted) {
              // Beep sound opcional
              // const audio = new Audio('/beep.mp3'); audio.play().catch(() => {});
              onDetected(result.getText());
              onClose(); // Cerrar al detectar
            }
            if (err) {
              // Muchos errores son "No QR code found", ignorar
            }
          }
        );
        setLoading(false);
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        if (mounted) {
            setError("No se pudo acceder a la cámara. Verifique permisos.");
            setLoading(false);
        }
      }
    };

    if (videoRef.current) {
        startScanning();
    }

    return () => {
      mounted = false;
      if (controlsRef.current) {
        // En @zxing/browser la forma de parar puede variar según versión, 
        // pero generalmente el objeto retornado tiene stop()
        // O usamos codeReader.reset() / stopAsyncDecode()
        try {
             // @zxing/browser devuelve un objeto 'IScannerControls' con método stop()
             controlsRef.current.stop(); 
        } catch(e) {
            console.error("Error stopping scanner", e);
        }
      }
      // codeReader.reset(); // Reset global library state if needed
    };
  }, [onDetected, onClose]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col items-center justify-center w-full max-w-lg mx-auto aspect-[4/3]">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white bg-black/50 p-2 rounded-full hover:bg-black/80 backdrop-blur-sm"
      >
        <X size={24} />
      </button>

      {error ? (
        <div className="text-white text-center p-6 space-y-4">
          <Camera size={48} className="mx-auto text-red-500" />
          <p className="font-medium">{error}</p>
          <button 
            onClick={onClose}
            className="bg-white text-black px-4 py-2 rounded-md font-bold hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <>
            <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
            />
            
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                    <RefreshCw className="animate-spin text-white w-10 h-10" />
                </div>
            )}

            {/* Overlay Grid */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-red-500/80 rounded-lg shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]">
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-500"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-500"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-500"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-500"></div>
                </div>
                <p className="absolute bottom-8 left-0 right-0 text-center text-white font-medium text-sm drop-shadow-md">
                    Apunta el código de barras aquí
                </p>
            </div>
        </>
      )}
    </div>
  );
}
