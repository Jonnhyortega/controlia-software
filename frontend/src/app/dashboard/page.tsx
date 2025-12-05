"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { ReceiptText } from "lucide-react";

import { useSales } from "./hooks/useSales";
import { useClock } from "./hooks/useClock";
import { useScanner } from "./hooks/useScanner";

import DashboardHeader from "../dashboard/components/dashboardHeader";
import ScannerOverlay from "./components/ScannerOverlay";
import SalesTable from "./components/SalesTable/salesTable";

import Overlay from "./components/overlay";
import CloseCashForm from "./components/Forms/closeCashForm";
import SalesForm from "./components/Forms/salesForm";

import Loading from "../../components/loading";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";


export default function DashboardPage() {
  const toast = useToast();

  const { data, loading, reload } = useSales();
  const { date, time } = useClock();

  const [pendingScannedCode, setPendingScannedCode] = useState<string | null>(null);

  const handleScannedCode = (code: string) => {
    setPendingScannedCode(code);

    // Si el formulario NO está abierto → lo abrimos automáticamente
    if (!showSalesForm) {
      if (data?.status === "cerrada") {
        toast.error("La caja está cerrada. No se pueden registrar más ventas.");
        return;
      }
      setShowSalesForm(true);
      setShowCloseCashForm(false);
    }
  };


  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [showCloseCashForm, setShowCloseCashForm] = useState(false);

  const handleRevert = async (saleId: string) => {
    try {
      await api.post(`/sales/${saleId}/revert`);
      toast.success("Venta anulada");
      reload();
    } catch {
      toast.error("No se pudo anular la venta");
    }
  };

  useEffect(() => {
  let buffer = "";
  let timer: NodeJS.Timeout | null = null;

  const handleKeyPress = (e: KeyboardEvent) => {
    // si está escribiendo en un input → ignoramos (no queremos romper nada)
    if (document.activeElement && (document.activeElement as HTMLElement).tagName === "INPUT") return;

    if (timer) clearTimeout(timer);

    // si presionó Enter → procesamos
    if (e.key === "Enter") {
      if (buffer.length > 0) {
        handleScannedCode(buffer);
        buffer = "";
      }
      return;
    }

    // solo aceptar números / letras
    if (/^[0-9A-Za-z]+$/.test(e.key)) {
      buffer += e.key;
    }

    // si pasan 300ms sin tipear → reset
    timer = setTimeout(() => {
      buffer = "";
    }, 300);
  };

  window.addEventListener("keydown", handleKeyPress);

  return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showSalesForm]);

  useEffect(() => {
  let buffer = "";
  let timer: NodeJS.Timeout | null = null;

  const handleKeyPress = (e: KeyboardEvent) => {
    // si está escribiendo en un input → ignoramos (no queremos romper nada)
    if (document.activeElement && (document.activeElement as HTMLElement).tagName === "INPUT") return;

    if (timer) clearTimeout(timer);

    // si presionó Enter → procesamos
    if (e.key === "Enter") {
      if (buffer.length > 0) {
        handleScannedCode(buffer);
        buffer = "";
      }
      return;
    }

    // solo aceptar números / letras
    if (/^[0-9A-Za-z]+$/.test(e.key)) {
      buffer += e.key;
    }

    // si pasan 300ms sin tipear → reset
    timer = setTimeout(() => {
      buffer = "";
    }, 300);
  };

  window.addEventListener("keydown", handleKeyPress);

  return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showSalesForm]);


  if (loading) return <Loading fullscreen message="Cargando..." />;

  const sales = data?.sales || [];
  const total = data?.totalSalesAmount || 0;


  return (
    <>
      <DashboardHeader
        date={date}
        time={time}
        showSalesForm={showSalesForm}
        showCloseCashForm={showCloseCashForm}
        isCashClosed={data?.status === "cerrada"}
        onNewSale={() => {
          if (data?.status === "cerrada") {
             toast.error("La caja está cerrada. No se pueden registrar más ventas.");
             return;
          }
          setShowSalesForm(true);
          setShowCloseCashForm(false);
        }}
        onCloseCash={() => {
          setShowCloseCashForm(true);
          setShowSalesForm(false);
        }}
      />


      <AnimatePresence>
        {showSalesForm && (
          <Overlay>
            <SalesForm
              scannedCode={pendingScannedCode}
              onBack={() => {
                setShowSalesForm(false);
                setPendingScannedCode(null);
              }}
              onCreated={async () => {
                await reload();
                setPendingScannedCode(null);
                setShowSalesForm(false);
              }}
              onScannedConsumed={() => setPendingScannedCode(null)}
            />

          </Overlay>
        )}

        {showCloseCashForm && (
          <Overlay>
            <CloseCashForm
              cashId={data?._id}
              onBack={() => setShowCloseCashForm(false)}
              onClosed={reload}
            />
          </Overlay>
        )}
      </AnimatePresence>

      <motion.div className="mt-6">
        {sales.length > 0 ? 
        (<SalesTable
          sales={sales.slice().reverse()}
          expanded={expandedSale}
          onExpand={(id) => setExpandedSale(expandedSale === id ? null : id)}
          onRevert={(saleId) => handleRevert (saleId)}
        />) : 
        (
          <div className="flex flex-col items-center justify-center py-14 text-gray-400">
            <ReceiptText className="w-12 h-12 mb-3 opacity-60" />
            <p className="text-center text-gray-400 text-lg">
              Todavía no registraste ventas.
              <br />
              <span className="text-gray-300 font-semibold">
                Cuando cargues la primera, aparecerá aquí.
              </span>
            </p>
          </div>
        )}

      </motion.div>
    </>
  );
}
