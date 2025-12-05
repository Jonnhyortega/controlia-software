"use client";

import { BadgePlus, BookOpenCheck, XCircle } from "lucide-react";

export default function DashboardHeader({
  date,
  time,
  onNewSale,
  onCloseCash,
  showSalesForm,
  showCloseCashForm,
}: any) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-6 bg-gradient-to-r from-primary to-primary-300 text-white py-4 px-4 md:py-6 md:px-8 rounded-2xl shadow-lg">

      {/* IZQUIERDA */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Ventas del día</h2>
        <span className="text-xs md:text-sm opacity-80 mt-1">Panel general de actividad</span>
      </div>

      {/* CENTRO (Fecha y hora) */}
      <div className="flex items-center gap-3 md:gap-6 text-sm md:text-lg font-semibold">
        <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm">
          {date}
        </div>
        <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm">
          {time}
        </div>
      </div>

      {/* DERECHA (Botones) */}
      <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-center">
        {/* BTN Nueva venta */}
        <button
          onClick={onNewSale}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-all px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-md font-medium text-sm md:text-base"
        >
          {showSalesForm ? (
            <XCircle className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <BadgePlus className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span>{showSalesForm ? "Cerrar" : "Nueva venta"}</span>
        </button>

        {/* BTN Cerrar caja */}
        <button
          onClick={onCloseCash}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 transition-all px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-md font-medium text-sm md:text-base"
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
