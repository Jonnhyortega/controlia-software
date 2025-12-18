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
    <div className="bg-black p-4 rounded-md border border-gray-800 text-white w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Escanear código</h2>
        <button
          className="px-2 py-1 bg-gray-700 rounded"
          onClick={() => {
            stopScanner();
            onClose();
          }}
        >
          Cerrar
        </button>
      </div>

      {/* Select camera */}
      <div className="mb-3">
        <select
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-full"
          disabled={!devices.length}
          value={selectedDeviceId || ""}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          {devices.map((d, i) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Cámara ${i + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Video */}
      <div className="border border-gray-700 rounded overflow-hidden mb-3">
        <video
          ref={videoRef}
          className="w-full h-56 object-cover bg-black"
          muted
          autoPlay
          playsInline
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 justify-between">
        <button
          onClick={startScanner}
          className="flex-1 py-2 bg-primary rounded text-white"
        >
          Iniciar
        </button>

        <button
          onClick={stopScanner}
          className="flex-1 py-2 bg-gray-700 rounded"
        >
          Detener
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      <p className="text-xs text-gray-400 mt-3">
        Consejo: si usás una pistola lectora USB, simplemente apuntá y dispará — detectará el código automáticamente.
      </p>
    </div>
  );
}
