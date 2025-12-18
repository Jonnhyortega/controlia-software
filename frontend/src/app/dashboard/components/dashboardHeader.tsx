"use client";

import { BadgePlus, BookOpenCheck, XCircle, TrendingDown, Wallet } from "lucide-react";
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
  totalRevenue = 0,
}: any) {
  const { formatCurrency } = useCustomization();

  return (
    <header className="relative w-full bg-white dark:bg-[#09090b] border border-gray-100 dark:border-zinc-900 p-6 md:p-8 rounded-md shadow-sm overflow-hidden group">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 p-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-[90px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700 opacity-50 dark:opacity-100" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side: Title & Revenue */}
        <div className="text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Wallet className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                    Ventas del día
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                    Panel general de actividad
                </p>
            </div>
          </div>

          {/* Revenue Badge */}
          <div className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-md font-bold text-xl shadow-sm">
            <span>{formatCurrency(totalRevenue)}</span>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
          {/* New Sale (Primary Action) */}
          <button
            onClick={onNewSale}
            disabled={isCashClosed}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-md font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:-translate-y-0.5
                  ${
                    isCashClosed
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none hover:translate-y-0"
                      : "bg-primary hover:bg-primary-600 text-white"
                  }
               `}
          >
            {showSalesForm ? <XCircle size={20} /> : <BadgePlus size={20} />}
            {showSalesForm ? "Cerrar" : "Nueva Venta"}
          </button>

          {/* Expense (Secondary Action) */}
          <button
            onClick={onAddExpense}
            disabled={isCashClosed}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-md font-medium border transition-all active:scale-95 hover:-translate-y-0.5
                  ${
                    isCashClosed
                      ? "opacity-50 cursor-not-allowed bg-gray-200 border-gray-100 text-gray-400 shadow-none hover:translate-y-0"
                      : "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/20"
                  }
               `}
          >
            {showExpenseForm ? (
              <XCircle size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
            {showExpenseForm ? "Cerrar" : "Gasto / Pago"}
          </button>

          {/* Close Cash (Tertiary/Standard Action) */}
          <button
            onClick={onCloseCash}
            disabled={isCashClosed && userRole !== "admin"}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-md font-medium border transition-all active:scale-95 hover:-translate-y-0.5
                  ${
                    isCashClosed && userRole !== "admin"
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-800"
                  }
               `}
          >
            {showCloseCashForm ? (
              <XCircle size={20} />
            ) : (
              <BookOpenCheck size={20} />
            )}
            {showCloseCashForm ? "Cerrar" : "Cerrar Caja"}
          </button>
        </div>
      </div>
    </header>
  );
}
