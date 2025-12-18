"use client";

import BarcodeScanner from "./BarcodeScanner";

interface ScannerOverlayProps {
  open: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
}
 
function ScannerOverlay({ open, onClose, onDetected }: ScannerOverlayProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-[#0f0f0f] p-4 rounded-md border border-gray-700 w-[95%] max-w-xl">
        <BarcodeScanner onDetected={onDetected} onClose={onClose} />
      </div>
    </div>
  );
}

export default ScannerOverlay;