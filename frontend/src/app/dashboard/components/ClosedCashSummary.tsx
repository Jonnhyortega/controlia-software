"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, AlertCircle, CheckCircle2, DollarSign, CreditCard } from "lucide-react";
import { DailyCash } from "../../../types/api";
import { useCustomization } from "../../../context/CustomizationContext";

interface ClosedCashSummaryProps {
  data: DailyCash;
}

export default function ClosedCashSummary({ data }: ClosedCashSummaryProps) {
  const { formatCurrency } = useCustomization();
  
  if (!data) return null;

  const {
    totalSalesAmount,
    totalOut,
    finalExpected,
    finalReal,
    difference = 0,
    closedAt,
    sales = [],
  } = data;

  const isPositive = difference >= 0;

  // 1. Calcular Costo Total de lo vendido
  let totalCost = 0;
  sales.forEach((sale: any) => {
    // Si sale es un objeto populated
    if (typeof sale === "object" && sale.products) {
      sale.products.forEach((p: any) => {
        // p.product puede ser el objeto populated (con cost) o null (venta manual)
        // Asumimos venta manual costo 0 si no hay ref
        const unitCost = p.product?.cost || 0;
        totalCost += unitCost * p.quantity;
      });
    }
  });

  // 2. Calcular Ganancia Pura
  // Ganancia = (Ventas - Costos) - Gastos(Salidas)
  const grossProfit = totalSalesAmount - totalCost; 
  const netProfit = grossProfit - (totalOut || 0);

  // 3. Desglose por Método de Pago
  const paymentMethods: Record<string, { count: number; total: number }> = {};
  
  sales.forEach((sale: any) => {
    if (typeof sale === "object") {
      const method = sale.paymentMethod || "Otros";
      if (!paymentMethods[method]) {
        paymentMethods[method] = { count: 0, total: 0 };
      }
      paymentMethods[method].count += 1;
      paymentMethods[method].total += sale.total;
    }
  });

  // Fix fecha
  const closedDateObj = closedAt ? new Date(closedAt) : null;
  const formattedTime =
    closedDateObj && !isNaN(closedDateObj.getTime())
      ? closedDateObj.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8"
    >
      {/* Header */}
      <div className="bg-gray-200 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} />
            Resumen de Cierre de Caja
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            La caja fue cerrada correctamente hoy a las <span className="font-semibold text-gray-700">{formattedTime}</span>
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-md text-sm font-semibold border ${
            difference === 0
              ? "bg-green-50 text-green-700 border-green-200"
              : isPositive
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {difference === 0
            ? "Cierre Perfecto"
            : `Diferencia: ${difference > 0 ? "+" : ""}${formatCurrency(difference)}`}
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="p-6 grid grid-cols-1 justify-center sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ingresos (Ventas) */}
        <div className="relative overflow-hidden rounded-md bg-blue-50/50 p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSalesAmount)}</p>
        </div>

        {/* Egresos (Gastos + Pagos) */}
        <div className="relative overflow-hidden rounded-md bg-rose-50/50 p-4 border border-rose-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-md">
              <TrendingDown size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Egresos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOut || 0)}</p>
        </div>

         {/* Ganancia Pura (Neta) */}
         <div className="relative overflow-hidden rounded-md bg-emerald-50/50 p-4 border border-emerald-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
              <DollarSign size={20} />
            </div>
            <span className="text-sm font-medium text-gray-600">Ganancia Pura</span>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
             (Ventas - Costos - Gastos)
          </p>
        </div>

        {/* Real en Caja (Lo que se contó) */}
        {/* <div className="relative overflow-hidden rounded-md bg-slate-900 p-4 text-white shadow-lg ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-md">
              <AlertCircle size={20} />
            </div>
            <span className="text-sm font-medium text-slate-300">Real en Efectivo</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(finalReal || 0)}</p>
        </div> */}
      </div>

      {/* Desglose de Métodos de Pago */}
      <div className="px-6 pb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <CreditCard size={16} />
            Desglose de Operaciones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
             {Object.entries(paymentMethods).map(([method, { count, total }]) => (
               <div key={method} className="bg-gray-200 border border-gray-100 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{method}</p>
                    <p className="text-xs text-gray-500">{count} operaciones</p>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
               </div>
             ))}
             {Object.keys(paymentMethods).length === 0 && (
                <p className="text-sm text-gray-400 italic">No hubo operaciones registradas.</p>
             )}
          </div>
      </div>
    </motion.div>
  );
}
