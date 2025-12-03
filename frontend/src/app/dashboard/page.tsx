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
import { useState } from "react";


export default function DashboardPage() {
  const toast = useToast();

  const { data, loading, reload } = useSales();
  const { date, time } = useClock();

  const scanner = useScanner((code) => {
    toast.success(`Código detectado: ${code}`);
  });

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

  if (loading) return <Loading fullscreen message="Cargando..." />;

  const sales = data?.sales || [];
  const total = data?.totalSalesAmount || 0;

  return (
    <>
      <ScannerOverlay
        open={scanner.open}
        onClose={scanner.hide}
        onDetected={scanner.handleDetected}
      />

      <DashboardHeader
        date={date}
        time={time}
        showSalesForm={showSalesForm}
        showCloseCashForm={showCloseCashForm}
        onNewSale={() => {
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
              onBack={() => setShowSalesForm(false)}
              onCreated={async () => {
                await reload();
                setShowSalesForm(false);
              }}
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
