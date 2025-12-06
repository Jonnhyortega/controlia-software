"use client";

import { BadgePlus, BookOpenCheck, XCircle, TrendingDown } from "lucide-react";

export default function DashboardHeader({
  onNewSale,
  onCloseCash,
  onAddExpense,
  showSalesForm,
  showCloseCashForm,
  showExpenseForm,
  userRole,
  isCashClosed,
}: any) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-6 bg-gradient-to-r from-primary to-primary-900 text-white py-4 px-4 md:py-6 md:px-8 rounded-2xl shadow-lg">

      {/* IZQUIERDA */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Ventas del día</h2>
        <span className="text-xs md:text-sm opacity-80 mt-1">Panel general de actividad</span>
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
    </header>
  );
}
