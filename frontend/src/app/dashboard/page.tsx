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
import { useRouter, useSearchParams } from "next/navigation";
import { X, Gift, Sparkles } from "lucide-react";


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

  // 🎁 Welcome Modal Logic
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setShowWelcomeModal(true);
      // Clean URL without refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

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

      {/* 🎁 Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <Overlay>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#121212] border border-[#2c2c2c] rounded-2xl w-full max-w-lg p-0 overflow-hidden shadow-2xl relative"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
              
              <button 
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 text-center relative z-0">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a Controlia!</h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-300 text-xs font-semibold border border-primary/20 flex items-center gap-1">
                    <Sparkles size={12} /> Prueba Gratuita Activa
                  </span>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 text-left border border-gray-800">
                  <p className="text-gray-300 text-sm mb-3">
                    Has comenzado tu periodo de prueba de <strong>90 días</strong> del Plan Básico.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       Acceso completo a todas las funciones
                    </li>
                    <li className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       Sin compromiso de compra
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-gray-500 mb-6">
                  Al finalizar los 90 días, podrás suscribirte al Plan Básico por solo <strong>$15.000 ARS/mes</strong> para continuar usando el servicio.
                </p>

                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all"
                >
                  ¡Entendido, comencemos! 🚀
                </button>
              </div>
            </motion.div>
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
