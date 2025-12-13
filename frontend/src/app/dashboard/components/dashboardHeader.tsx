"use client";

import { BadgePlus, BookOpenCheck, XCircle, TrendingDown, DollarSign } from "lucide-react";
import { useCustomization } from "../../../context/CustomizationContext";

export default function DashboardHeader({
  onNewSale,
  onCloseCash,
  onAddExpense,
  showSalesForm,
  showCloseCashForm,
  showExpenseForm,
  userRole,
  isCashClosed,
  totalRevenue = 0, // 👈 Nueva prop
}: any) {
  const { formatCurrency } = useCustomization();

  return (
    <header className="relative flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-6 bg-primary text-white py-4 px-4 md:py-6 md:px-8 rounded-2xl shadow-lg overflow-hidden">
      {/* Background Gradient Overlay to simulate depth without hardcoded colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none" />
      
      {/* Content wrapper for z-index */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-6">

      {/* IZQUIERDA */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Ventas del día</h2>
        <span className="text-xs md:text-sm opacity-80 mt-1 mb-3">Panel general de actividad</span>
        
        {/* Recaudación Final destacada */}
        <div className="bg-white text-green-600 px-4 py-1.5 rounded-full font-bold text-sm md:text-base shadow-sm flex items-center gap-2">
            {/* <DollarSign size={18} className="text-green-600 stroke-[3]" /> */}
            <span>Recaudación: {formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      {/* DERECHA (Botones) */}
      <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-center">
        {/* BTN Nueva venta */}
        <button
          onClick={onNewSale}
          disabled={isCashClosed}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-all px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-md font-medium text-sm md:text-base ${
             isCashClosed ? "opacity-50 cursor-not-allowed hover:bg-white/20" : ""
          }`}
        >
          {showSalesForm ? (
            <XCircle className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <BadgePlus className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span>{showSalesForm ? "Cerrar" : "Nueva venta"}</span>
        </button>

         {/* BTN Registrar Gasto */}
         <button
          onClick={onAddExpense}
          disabled={isCashClosed}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 transition-all px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-md font-medium text-sm md:text-base border border-rose-200/20 ${
             isCashClosed ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {showExpenseForm ? (
             <XCircle className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
             <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span>{showExpenseForm ? "Cerrar" : "Gasto / Pago"}</span>
        </button>

        {/* BTN Cerrar caja */}
        <button
          onClick={onCloseCash}
          disabled={isCashClosed && userRole !== "admin"}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 transition-all px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-md font-medium text-sm md:text-base ${
             isCashClosed && userRole !== "admin" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {showCloseCashForm ? (
            <XCircle className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <BookOpenCheck className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span>{showCloseCashForm ? "Cerrar" : "Cerrar caja"}</span>
        </button>
      </div>
      </div>
    </header>
  );
}
