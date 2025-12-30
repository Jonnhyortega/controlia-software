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
    updatedAt,
    sales = [],
  } = data;

// ... (lines 27-62 remain unchanged, but I need to replace the destructuring block and the date logic block)

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

  // Fix fecha: Use closedAt if available, otherwise fallback to updatedAt
  const effectiveDate = closedAt || updatedAt;
  const closedDateObj = effectiveDate ? new Date(effectiveDate) : null;
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
      className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden mb-8"
    >
      {/* Header */}
      <div className="bg-muted/30 border-b border-border px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-funnel-display font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={20} />
            Resumen de Cierre de Caja
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            La caja fue cerrada correctamente hoy a las <span className="font-semibold text-foreground">{formattedTime}</span>
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-md text-sm font-semibold border ${
            difference === 0
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400"
              : isPositive
              ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400"
              : "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400"
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
        <div className="relative overflow-hidden rounded-md bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-100 dark:border-blue-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSalesAmount)}</p>
        </div>

        {/* Egresos (Gastos + Pagos) */}
        <div className="relative overflow-hidden rounded-md bg-rose-50/50 dark:bg-rose-950/20 p-4 border border-rose-100 dark:border-rose-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100/80 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-md">
              <TrendingDown size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Egresos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalOut || 0)}</p>
        </div>

         {/* Ganancia Pura (Neta) */}
         <div className="relative overflow-hidden rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 p-4 border border-emerald-100 dark:border-emerald-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-md">
              <DollarSign size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Ganancia Pura</span>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
             (Ventas - Costos - Gastos)
          </p>
        </div>

        {/* Real en Caja (Lo que se contó) */}
        {/* <div className="relative overflow-hidden rounded-xl bg-secondary p-4 text-secondary-foreground border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-background text-muted-foreground rounded-md">
              <AlertCircle size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Real en Efectivo</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(finalReal || 0)}</p>
        </div> */}
      </div>

      {/* Desglose de Métodos de Pago */}
      <div className="px-6 pb-6">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <CreditCard size={16} />
            Desglose de Operaciones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
             {Object.entries(paymentMethods).map(([method, { count, total }]) => (
               <div key={method} className="bg-muted/40 border border-border rounded-md p-3 flex justify-between items-center transition-colors hover:bg-muted/60">
                  <div>
                    <p className="font-semibold text-foreground capitalize">{method}</p>
                    <p className="text-xs text-muted-foreground">{count} operaciones</p>
                  </div>
                  <span className="font-bold text-foreground">{formatCurrency(total)}</span>
               </div>
             ))}
             {Object.keys(paymentMethods).length === 0 && (
                <p className="text-sm text-muted-foreground italic">No hubo operaciones registradas.</p>
             )}
          </div>
      </div>
    </motion.div>
  );
}
