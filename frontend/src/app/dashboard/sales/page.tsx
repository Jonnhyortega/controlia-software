"use client";

import { useEffect, useState } from "react";
import { Plus, Receipt, ChartBar, History as HistoryIcon, List, ShoppingCart } from "lucide-react";
import { CollapsibleSection } from "../../../components/ui/CollapsibleSection";
import HistorySales from "./historySales";
import { useSales } from "../hooks/useSales";
import SalesStats from "../components/SalesTable/SalesStats";
import SalesTable from "../components/SalesTable/salesTable";
import HistoricalStats from "../components/SalesTable/HistoricalStats";
import { api, getSales } from "../../../utils/api";
import { useToast } from "../../../context/ToastContext";
import Loading from "../../../components/loading";

export default function VentasPage() {
  const { data, loading, reload } = useSales();
  const toast = useToast();
  const [expandedSale, setExpandedSale] = useState<string | null>(null);

  // Paginación de Historial
  const [historySalesData, setHistorySalesData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Cargar historial inicial al montar
  useEffect(() => {
    // Pequeño delay para no saturar carga inicial
    setTimeout(() => {
        fetchHistorySales(1);
    }, 500);
  }, []);

  const fetchHistorySales = async (p: number) => {
    setLoadingHistory(true);
    try {
      const res = await getSales(p, 10); // Limit 10
      setHistorySalesData(res.sales || []);
      setPage(res.page || 1);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error("Error fetching sales page:", err);
      // toast?.error?.("Error cargando historial de ventas"); // Silent fail preferred on init
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRevert = async (saleId: string) => {
    try {
      await api.post(`/sales/${saleId}/revert`);
      toast.success("Venta anulada");
      reload();
    } catch {
      toast.error("No se pudo anular la venta");
    }
  };

  if (loading) return <Loading />;

  // Obtener ventas del día actual
  const currentSales = data?.sales || [];

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
           <ShoppingCart className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Ventas
          </h1>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Control general y métricas
          </span>
        </div>
      </div>
      {/* 📊 Estadísticas del Día */}
      {currentSales.length > 0 && (
         <CollapsibleSection
            title={`Ventas de Hoy (${new Date().toLocaleDateString("es-AR")})`}
            icon={Receipt}
            defaultOpen={false}
         >
            <SalesStats sales={currentSales} />
            
            <div className="mt-4 bg-white dark:bg-[#18181b] rounded-md shadow-sm border border-gray-200 dark:border-[#27272a] p-4 transition-colors">
               <SalesTable 
                  sales={currentSales.slice().reverse()}
                  expanded={expandedSale}
                  onExpand={(id) => setExpandedSale(expandedSale === id ? null : id)}
                  onRevert={handleRevert}
                  simpleMode={false} // Activate Full Mode (Search, Filter, Export)
               />
            </div>
         </CollapsibleSection>
      )}

      {currentSales.length === 0 && (
         <div className="bg-gray-200 dark:bg-[#18181b] rounded-md p-8 text-center border border-dashed border-gray-300 dark:border-[#27272a] mb-8 transition-colors">
            <p className="text-gray-500 dark:text-gray-400">No hay ventas registradas en la caja abierta de hoy.</p>
         </div>
      )}

      {/* 📜 Historial de Ventas Pasadas */}
      <CollapsibleSection title="Métricas Históricas" icon={ChartBar} defaultOpen={false}>
          <div className="mb-4">
             <p className="text-sm text-gray-500 dark:text-gray-400">Resumen de rendimiento general</p>
          </div>
          <HistoricalStats />
      </CollapsibleSection>

      <CollapsibleSection title="Registro de Cajas Diarias" icon={HistoryIcon} defaultOpen={false}>
          <HistorySales />
      </CollapsibleSection>

      {/* 📒 Lista Completa de Ventas (Paginada) */}
      <CollapsibleSection title="Todas las Ventas" icon={List} defaultOpen={false}>
         <div className="bg-white dark:bg-[#18181b] rounded-md shadow-sm border border-gray-200 dark:border-[#27272a] p-4 transition-colors">
             {loadingHistory ? (
                 <div className="py-8 text-center text-gray-500">Cargando ventas...</div>
             ) : (
                 <>
                     <SalesTable 
                         sales={historySalesData} 
                         expanded={expandedSale}
                         onExpand={(id) => setExpandedSale(expandedSale === id ? null : id)}
                         onRevert={handleRevert}
                         simpleMode={true} // Simple mode to avoid confusion with client-side local search
                     />
                     
                     {/* Controles de Paginación */}
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-[#27272a]">
                         <button 
                             disabled={page <= 1}
                             onClick={() => fetchHistorySales(page - 1)}
                             className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#3f3f46] rounded-md hover:bg-gray-50 dark:hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                         >
                             Anterior
                         </button>
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                             Página <span className="font-bold">{page}</span>
                         </span>
                         <button 
                             disabled={page >= totalPages}
                             onClick={() => fetchHistorySales(page + 1)}
                             className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#3f3f46] rounded-md hover:bg-gray-50 dark:hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                         >
                             Siguiente
                         </button>
                     </div>
                 </>
             )}
         </div>
      </CollapsibleSection>
    </section>
  );
}
