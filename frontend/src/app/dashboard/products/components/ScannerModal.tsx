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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-md p-4 shadow-xl">
        <BarcodeScanner onDetected={onDetected} onClose={onClose} />
      </div>
    </div>
  );
}
