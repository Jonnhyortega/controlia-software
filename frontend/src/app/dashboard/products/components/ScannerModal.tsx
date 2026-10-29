"use client";
import dynamic from "next/dynamic";

interface ScannerModalProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner = dynamic(() => import("../../components/BarcodeScanner"), {
  ssr: false,
});

export function ScannerModal({ onDetected, onClose }: ScannerModalProps) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
        <BarcodeScanner onDetected={onDetected} onClose={onClose} />
      </div>
    </div>
  );
}
