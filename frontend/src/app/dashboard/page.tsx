"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { ReceiptText } from "lucide-react";

import { useSales } from "./hooks/useSales";
import { useClock } from "./hooks/useClock";
// import { useScanner } from "./hooks/useScanner"; // Seems unused in original file imports list in Step 54 but maybe I missed it. Step 54 shows line 9: import { useScanner } from "./hooks/useScanner";
import { useScanner } from "./hooks/useScanner";
import { useAuth } from "../../context/authContext";

import DashboardHeader from "../dashboard/components/dashboardHeader";
import ScannerOverlay from "./components/ScannerOverlay";
import SalesTable from "./components/SalesTable/salesTable";

import Overlay from "./components/overlay";
import CloseCashForm from "./components/Forms/closeCashForm";
import SalesForm from "./components/Forms/salesForm";
import ExpenseForm from "./components/Forms/expenseForm";

import Loading from "../../components/loading";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";


export default function DashboardPage() {
  const toast = useToast();
  const { user } = useAuth();
  const { data, loading, reload } = useSales();
  // const { date, time } = useClock();

  const [pendingScannedCode, setPendingScannedCode] = useState<string | null>(null);

  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [showCloseCashForm, setShowCloseCashForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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
      setShowExpenseForm(false);
    }
  };


  const handleRevert = async (saleId: string) => {
    try {
      await api.post(`/sales/${saleId}/revert`);
      toast.success("Venta anulada");
      reload();
    } catch {
      toast.error("No se pudo anular la venta");
    }
  };



  // There was a duplicate useEffect in Step 54 (lines 62-95 and 97-130 are identical). I will keep only one.
  

  if (loading) return <Loading fullscreen message="Cargando..." />;

  const sales = data?.sales || [];
  
  // Note: 'total' was defined in original file but seemingly unused in JSX? 
  // const total = data?.totalSalesAmount || 0; 

  return (
    <>
      <DashboardHeader
        userRole={user?.role}
        showSalesForm={showSalesForm}
        showCloseCashForm={showCloseCashForm}
        showExpenseForm={showExpenseForm}
        isCashClosed={data?.status === "cerrada"}
        onNewSale={() => {
          if (data?.status === "cerrada") {
             toast.error("La caja está cerrada. No se pueden registrar más ventas.");
             return;
          }
          setShowSalesForm(true);
          setShowCloseCashForm(false);
          setShowExpenseForm(false);
        }}
        onCloseCash={() => {
          setShowCloseCashForm(true);
          setShowSalesForm(false);
          setShowExpenseForm(false);
        }}
        onAddExpense={() => {
           if (data?.status === "cerrada") {
             toast.error("La caja está cerrada");
             return;
           }
           setShowExpenseForm(true);
           setShowSalesForm(false);
           setShowCloseCashForm(false);
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
              onClosed={() => {
                reload();
                setShowCloseCashForm(false);
              }}
            />
          </Overlay>
        )}

        {showExpenseForm && (
          <Overlay>
             <ExpenseForm
                cashId={data?._id}
                currentExpenses={data?.extraExpenses || []}
                onBack={() => setShowExpenseForm(false)}
                onCreated={() => {
                   reload();
                   setShowExpenseForm(false);
                }}
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
