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
    <header className="flex flex-col md:flex-row justify-between items-center w-full gap-6 bg-gradient-to-r from-primary to-primary-300 text-white py-6 px-8 rounded-2xl shadow-lg">

      {/* IZQUIERDA */}
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold leading-tight">Ventas del día</h2>
        <span className="text-sm opacity-80 mt-1">Panel general de actividad</span>
      </div>

      {/* CENTRO (Fecha y hora) */}
      <div className="flex items-center gap-6 text-lg font-semibold">
        <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
          {date}
        </div>
        <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
          {time}
        </div>
      </div>

      {/* DERECHA (Botones) */}
      <div className="flex gap-4">
        {/* BTN Nueva venta */}
        <button
          onClick={onNewSale}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-all px-5 py-2.5 rounded-xl shadow-md font-medium"
        >
          {showSalesForm ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <BadgePlus className="w-5 h-5" />
          )}
          <span>{showSalesForm ? "Cerrar formulario" : "Nueva venta"}</span>
        </button>

        {/* BTN Cerrar caja */}
        <button
          onClick={onCloseCash}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 transition-all px-5 py-2.5 rounded-xl shadow-md font-medium"
        >
          {showCloseCashForm ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <BookOpenCheck className="w-5 h-5" />
          )}
          <span>{showCloseCashForm ? "Cerrar formulario" : "Cerrar caja"}</span>
        </button>
      </div>
    </header>
  );
}
