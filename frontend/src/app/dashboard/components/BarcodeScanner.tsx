"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // -----------------------------------------------------
  // 1) PEDIR PERMISO DE CÁMARA APENAS SE MONTA EL MODAL
  // -----------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        // Fuerza al navegador a mostrar el popup de permisos
        await navigator.mediaDevices.getUserMedia({ video: true });

        // Ahora sí, deviceId y labels aparecen correctamente
        const all = await navigator.mediaDevices.enumerateDevices();
        const cams = all.filter((d) => d.kind === "videoinput");

        setDevices(cams);
        if (cams.length) setSelectedDeviceId(cams[0].deviceId);
        else setError("No se detectan cámaras.");
      } catch (err) {
        console.error(err);
        setError("Permiso de cámara denegado o no disponible.");
      }
    })();

    return () => stopScanner();
  }, []);

  // -----------------------------------------------------
  // 2) Iniciar scanner
  // -----------------------------------------------------
  async function startScanner() {
    if (!selectedDeviceId) {
      setError("No hay cámara seleccionada.");
      return;
    }
    if (!videoRef.current) {
      setError("El video no está listo.");
      return;
    }

    setError(null);
    setScanning(true);
    stopScanner();

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const code =
              typeof result.getText === "function"
                ? result.getText()
                : (result as any).text || "";

            if (code) {
              stopScanner();
              onDetected(code);
            }
          }
        }
      );

      // ZXing fallback (por si NO setea srcObject)
      if (!videoRef.current.srcObject) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
        });
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error(err);
      setError("No se pudo iniciar la cámara.");
      setScanning(false);
    }
  }

  // -----------------------------------------------------
  // 3) Detener scanner
  // -----------------------------------------------------
  function stopScanner() {
    setScanning(false);

    if (readerRef.current) {
      try {
        (readerRef.current as any)?.reset?.();
      } catch {}
      readerRef.current = null;
    }

    if (videoRef.current?.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="bg-[#18181b] p-6 rounded-xl border border-zinc-800 text-white w-full shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight">Escanear código</h2>
        <button
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors font-medium"
          onClick={() => {
            stopScanner();
            onClose();
          }}
        >
          Cerrar
        </button>
      </div>

      {/* Select camera */}
      <div className="mb-4">
        <select
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all appearance-none cursor-pointer"
          disabled={!devices.length}
          value={selectedDeviceId || ""}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          {devices.map((d, i) => (
            <option key={d.deviceId} value={d.deviceId} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
              {d.label || `Cámara ${i + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Video */}
      <div className="border border-zinc-800 bg-black rounded-lg overflow-hidden mb-6 relative shadow-inner">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          muted
          autoPlay
          playsInline
        />
        {scanning && (
            <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none animate-pulse"></div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-between">
        <button
          onClick={startScanner}
          className="flex-1 py-3 bg-primary hover:bg-primary-600 rounded-lg text-white font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          Iniciar Cámara
        </button>

        <button
          onClick={stopScanner}
          className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg font-bold transition-all active:scale-95"
        >
          Detener
        </button>
      </div>

      {error && <div className="p-3 mt-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">{error}</div>}

      <p className="text-xs text-zinc-500 mt-6 text-center">
        Consejo: si usás una pistola lectora USB, simplemente apuntá y dispará — detectará el código automáticamente sin usar la cámara.
      </p>
    </div>
  );
}
