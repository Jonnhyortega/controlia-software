"use client";

import { useEffect, useState } from "react";
import { getClosedCashDays } from "@/utils/api"; 
import { TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useCustomization } from "@/context/CustomizationContext";

import { useAuth } from "@/context/authContext";

export default function HistoricalStats() {
  const { user } = useAuth();
  const [dates, setDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { formatCurrency } = useCustomization();

  useEffect(() => {
    const fetchDays = async () => {
      if (!user?._id) return;
      try {
        const days = await getClosedCashDays(user._id);
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
  }, [user]);

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

  const formatDate = (val: string) => new Date(val).toLocaleDateString("es-AR", { timeZone: "UTC", day:"numeric", month:"short" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       
       {/* 🏆 Día Récord Ventas */}
       <div className="bg-gradient-to-br from-green-500/50 to-green-500/50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-md border border-green-100 dark:border-green-900/40 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-400 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md">
                <TrendingUp size={20} />
             </div>
             <p className="text-sm font-semibold text-green-800 dark:text-green-100">Día Récord de Ventas</p>
          </div>
          <div className="mt-2">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(bestSalesDay?.totalSalesAmount || 0)}</h3>
             <p className="text-xs text-black  dark:text-green-600 dark:text-green-300mt-1 font-medium">
               📅 {bestSalesDay ? formatDate(bestSalesDay.date) : "-"}
             </p>
          </div>
       </div>

       {/* ⚠️ Día Máx Gastos */}
       <div className="bg-gradient-to-br from-red-600/50 to-red-800/50 dark:from-red-600/20 dark:to-red-800/20  p-5 rounded-md border border-red-100 dark:border-red-900/40 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-gray-100/20 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md">
                <AlertCircle size={20} />
             </div>
             <p className="text-sm font-semibold text-red-900 dark:text-red-500">Mayor Gasto Diario</p>
          </div>
          <div className="mt-2">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(maxExpensesDay?.totalOut || 0)}</h3>
             <p className="text-xs text-red-900 dark:text-red-500 mt-1 font-medium">
               📅 {maxExpensesDay ? formatDate(maxExpensesDay.date) : "-"}
             </p>
          </div>
       </div>

       {/* 📅 Mejor Mes */}
       <div className="bg-gradient-to-br from-blue-500/50 to-indigo-500/50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-md border border-blue-100 dark:border-blue-900/40 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-md">
                <Calendar size={20} />
             </div>
             <p className="text-sm font-semibold text-blue-800 dark:text-blue-100">Mejor Mes ({currentYear})</p>
          </div>
          <div className="mt-2 text-wrap">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{bestMonthName}</h3>
             <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 font-medium">
                Total: {formatCurrency(bestMonthAmount as number)}
             </p>
          </div>
       </div>

    </div>
  );
}
