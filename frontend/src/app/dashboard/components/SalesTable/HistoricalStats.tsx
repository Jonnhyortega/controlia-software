"use client";

import { useEffect, useState } from "react";
import { getClosedCashDays } from "@/utils/api"; 
import { TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function HistoricalStats() {
  const [dates, setDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const days = await getClosedCashDays();
        // Ordenar cronológicamente descendente
        const sorted = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDates(sorted);
      } catch (err) {
        console.error("Error fetching historical data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDays();
  }, []);

  if (loading || dates.length === 0) return null;

  // --- CÁLCULOS ---

  // 1. Día con más ventas
  const bestSalesDay = [...dates].sort((a, b) => b.totalSalesAmount - a.totalSalesAmount)[0];
  
  // 2. Día con más gastos
  const maxExpensesDay = [...dates].sort((a, b) => b.totalOut - a.totalOut)[0];

  // 3. Ventas por mes (Año actual)
  const currentYear = new Date().getUTCFullYear();
  const salesByMonth = dates.reduce((acc: any, day) => {
     const d = new Date(day.date);
     if (d.getUTCFullYear() !== currentYear) return acc;
     
     const monthKey = d.toLocaleString('es-AR', { month: 'long', timeZone: 'UTC' });
     acc[monthKey] = (acc[monthKey] || 0) + day.totalSalesAmount;
     return acc;
  }, {});
  
  const bestMonthEntry = Object.entries(salesByMonth).sort((a: any, b: any) => b[1] - a[1])[0];
  const bestMonthName = bestMonthEntry ? bestMonthEntry[0] : "N/A";
  const bestMonthAmount = bestMonthEntry ? bestMonthEntry[1] : 0;


  const formatCurrency = (val: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(val);
  const formatDate = (val: string) => new Date(val).toLocaleDateString("es-AR", { timeZone: "UTC", day:"numeric", month:"short" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       
       {/* 🏆 Día Récord Ventas */}
       <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-200 text-green-700 rounded-lg">
                <TrendingUp size={20} />
             </div>
             <p className="text-sm font-semibold text-green-800">Día Récord de Ventas</p>
          </div>
          <div className="mt-2">
             <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(bestSalesDay?.totalSalesAmount || 0)}</h3>
             <p className="text-xs text-green-600 mt-1 font-medium">
               📅 {bestSalesDay ? formatDate(bestSalesDay.date) : "-"}
             </p>
          </div>
       </div>

       {/* ⚠️ Día Máx Gastos */}
       <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-2xl border border-red-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-200 text-red-700 rounded-lg">
                <AlertCircle size={20} />
             </div>
             <p className="text-sm font-semibold text-red-800">Mayor Gasto Diario</p>
          </div>
          <div className="mt-2">
             <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(maxExpensesDay?.totalOut || 0)}</h3>
             <p className="text-xs text-red-600 mt-1 font-medium">
               📅 {maxExpensesDay ? formatDate(maxExpensesDay.date) : "-"}
             </p>
          </div>
       </div>

       {/* 📅 Mejor Mes */}
       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-200 text-blue-700 rounded-lg">
                <Calendar size={20} />
             </div>
             <p className="text-sm font-semibold text-blue-800">Mejor Mes ({currentYear})</p>
          </div>
          <div className="mt-2 text-wrap">
             <h3 className="text-2xl font-bold text-gray-900 capitalize">{bestMonthName}</h3>
             <p className="text-xs text-blue-600 mt-1 font-medium">
                Total: {formatCurrency(bestMonthAmount as number)}
             </p>
          </div>
       </div>

    </div>
  );
}
