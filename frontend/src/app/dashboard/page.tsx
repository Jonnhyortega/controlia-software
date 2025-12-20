"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";


import { useSales } from "./hooks/useSales";
import { useClock } from "./hooks/useClock";
import { useScanner } from "./hooks/useScanner"; // 👈 Import new Scanner hook
import { useAuth } from "../../context/authContext";

import DashboardHeader from "../dashboard/components/dashboardHeader";
import ScannerOverlay from "./components/ScannerOverlay";
import SalesTable from "./components/SalesTable/salesTable";
import ExpensesTable from "./components/ExpensesTable";
import ClosedCashSummary from "./components/ClosedCashSummary";
import SimpleStats from "./components/SimpleStats";

import Overlay from "./components/overlay";
import CloseCashForm from "./components/Forms/closeCashForm";
import SalesForm from "./components/Forms/salesForm";
import ExpenseForm from "./components/Forms/expenseForm";
import { ConfirmDialog } from "./components/confirmDialog";

import Loading from "../../components/loading";
import { api, updateDailyCash } from "../../utils/api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Gift, Sparkles, TrendingDown, BarChart3, ReceiptText } from "lucide-react";
import { CollapsibleSection } from "../../components/ui/CollapsibleSection";


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
  
  const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      title: "",
      message: "",
      onConfirm: () => {},
      onCancel: () => {},
    });

  // 🎁 Welcome Modal Logic
  const searchParams = useSearchParams();
  // const router = useRouter(); // Unused
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

  // 🔌 Scanner Hook (Keyboard & Camera)
  const { isCameraOpen, closeCamera } = useScanner(handleScannedCode);


  const handleRevert = async (saleId: string) => {
    // Verificar si es una transacción (hackish: las transacciones no estarán en la API /sales/:id/revert igual)
    // Lo ideal sería que la tabla maneje acciones distintas, pero por seguridad:
    const item = sales.find((s: any) => s._id === saleId);
    if (item?.isTransaction) {
        toast.error("La anulación de cobros debe hacerse desde el perfil del cliente.");
        return;
    }

    try {
      await api.post(`/sales/${saleId}/revert`);
      toast.success("Venta anulada");
      reload();
    } catch {
      toast.error("No se pudo anular la venta");
    }
  };

  const handleExpenseDelete = (index: number) => {
    if (!data?.extraExpenses) return;
    const itemToDelete = data.extraExpenses[index];

    setConfirmDialog({
        open: true,
        title: "Eliminar gasto",
        message: "¿Estás seguro de eliminar este gasto?",
        onConfirm: async () => {
             setConfirmDialog((prev) => ({ ...prev, open: false }));
             
             try {
                 // 1. Si es una Transacción (Pago a Proveedor), usar su endpoint específico
                 if (itemToDelete.isTransaction && itemToDelete._id) {
                     await api.delete(`/transactions/${itemToDelete._id}`);
                     toast.success("Pago eliminado correctamente");
                     reload();
                     return;
                 }

                 // 2. Si es un gasto manual, actualizamos la caja diaria
                 // IMPORTANTE: Filtramos las que SON transacciones para no guardarlas como texto plano
                 const cleanExpenses = data.extraExpenses.filter((e: any, i: number) => {
                     // Borrar el item seleccionado
                     if (i === index) return false;
                     // Borrar items que sean transacciones (se regeneran solos al recargar)
                     if (e.isTransaction) return false;
                     return true;
                 });
                 
                 // Enviamos la lista limpia y overwrite=true para reemplazar
                 await updateDailyCash(data._id, { extraExpenses: cleanExpenses, overwrite: true } as any);
                 toast.success("Gasto eliminado");
                 reload();

             } catch (error) {
                console.error("Error deleting expense:", error);
                toast.error("Error al eliminar gasto. Intente recargar.");
             }
        },
        onCancel: () => setConfirmDialog((prev) => ({ ...prev, open: false })),
    });
  };


  if (loading) return <Loading fullscreen message="Cargando..." />;

  // 🔄 UNIFICAR VENTAS Y COBROS (Transactions)
  const salesList = data?.sales || [];
  const transactionsList = data?.transactions || []; // Vienen del endpoint modificado

  // Adaptar transacciones para que parezcan ventas en la tabla
  const normalizedTransactions = transactionsList.map((tx: any) => ({
      _id: tx._id,
      createdAt: tx.date || tx.createdAt,
      paymentMethod: "Cobro Deuda", // Etiqueta distintiva
      total: tx.amount,
      amountPaid: tx.amount,
      amountDebt: 0,
      products: [
          {
              name: `Pago de ${tx.client?.name || "Cliente"}`,
              quantity: 1,
              price: tx.amount
          }
      ],
      isTransaction: true // Flag para identificar
  }));

  // Fusionar y ordenar por fecha (más reciente primero)
  const combinedList = [...salesList, ...normalizedTransactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sales = combinedList; // Usamos la lista combinada como "sales" para la tabla
  
  // Calcular el total real ingresado sumando las ventas (para asegurar consitencia visual)
  // Calcular el total real ingresado
  // PRIORIDAD: Usar el valor 'totalSalesAmount' que viene del backend (DailyCash),
  // ya que este incluye tanto ventas directas como PAGOS DE DEUDA de clientes.
  // Si no existe (caso edge), calculamos sumando ventas visibles.
  
  const backendTotal = data?.totalSalesAmount; // useSales devuelve el objeto flatten 'data' que es el dailyCash + sales array.
  
  // Backup manual (solo ventas, no incuye pagos de deuda externa)
  const manualTotalRevenue = sales.reduce((acc: number, sale: any) => {
      const realPaid = (sale.amountPaid !== undefined && sale.amountPaid !== null) 
                        ? Number(sale.amountPaid) 
                        : Number(sale.total);
      return acc + (isNaN(realPaid) ? 0 : realPaid);
  }, 0);

  // Si data.totalSalesAmount es numérico válido, lo usamos. Si no, usamos el manual.
  const displayTotalRevenue = (typeof backendTotal === 'number') ? backendTotal : manualTotalRevenue;

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
        // Usamos el calculado para máxima precisión visual
        totalRevenue={displayTotalRevenue}
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
      
      {/* 📷 Scanner Overlay Visual (Cámara logic controlled by useScanner) */}
      <ScannerOverlay 
         open={isCameraOpen} 
         onClose={closeCamera} 
         onDetected={(code) => {
             closeCamera();
             handleScannedCode(code);
         }}
      />

      <motion.div className="mt-6">
        {sales.length > 0 ? 
        (
        <div className="border-gray-100 dark:border-zinc-900">
          {/* Tabla de Ventas */}
            <CollapsibleSection title="Transacciones Recientes" icon={ReceiptText} defaultOpen={true}>
              <SalesTable
                sales={sales}
                expanded={expandedSale}
                onExpand={(id: any) => setExpandedSale(expandedSale === id ? null : id)}
                onRevert={(saleId: any) => handleRevert(saleId)}
                simpleMode={true}
              />
            </CollapsibleSection>
          {/* 📊 Estadísticas Desplegables */}
            <CollapsibleSection title="Estadísticas Rápidas" icon={BarChart3} defaultOpen={false}>
                <SimpleStats sales={sales} />
            </CollapsibleSection>           
        </div>
        ) : 
        (
          <div className="flex bg-white dark:bg-zinc-900 flex-col items-center justify-center py-14 text-gray-400 border border-gray-200 dark:border-zinc-800 rounded-md mb-6">
            <ReceiptText className="w-12 h-12 mb-3 opacity-60" />
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
              Todavía no registraste ventas.
              <br />
              <span className="text-gray-400 dark:text-gray-500 font-semibold text-sm">
                Cuando cargues la primera, aparecerá aquí.
              </span>
            </p>
          </div>
        )}
      </motion.div>


      {/* 📉 Gastos Desplegables */}
      {data?.extraExpenses.length > 0 && (
         <CollapsibleSection title="Gastos y Pagos del Día" icon={TrendingDown} defaultOpen={false}>
             <ExpensesTable 
                expenses={data?.extraExpenses || []} 
                onDelete={handleExpenseDelete}
             />
         </CollapsibleSection>
      )}


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
      
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />

      {/* 🎁 Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <Overlay>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#121212] border border-[#2c2c2c] rounded-md w-full max-w-lg p-0 overflow-hidden shadow-2xl relative"
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

                <div className="bg-[#1a1a1a] rounded-md p-4 mb-6 text-left border border-gray-800">
                  <p className="text-gray-300 text-sm mb-3">
                    Has comenzado tu periodo de prueba de <strong>90 días</strong> del Plan Base.
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
                  Al finalizar los 90 días, podrás suscribirte al Plan Base por solo <strong>$15.000 ARS/mes</strong> para continuar usando el servicio.
                </p>

                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-3 rounded-md transition-all"
                >
                  ¡Entendido, comencemos! 🚀
                </button>
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>

      <div className="mt-8 border-gray-100 dark:border-zinc-900">
        {data?.status === "cerrada" && data && <ClosedCashSummary data={data} />}
      </div>

    </>

  );
}
