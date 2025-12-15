"use client";

import { useEffect, useState } from "react";
import { Plus, Receipt } from "lucide-react";
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
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Ventas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
             Ventas del día actual y registros históricos.
          </p>
        </div>
      </div>

      {/* 📊 Estadísticas del Día */}
      {currentSales.length > 0 && (
         <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
               <Receipt size={20} className="text-primary" />
               Ventas de Hoy ({new Date().toLocaleDateString("es-AR")})
            </h2>
            <SalesStats sales={currentSales} />
            
            <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-sm border border-gray-200 dark:border-[#27272a] p-4 transition-colors">
               <SalesTable 
                  sales={currentSales.slice().reverse()}
                  expanded={expandedSale}
                  onExpand={(id) => setExpandedSale(expandedSale === id ? null : id)}
                  onRevert={handleRevert}
                  simpleMode={false} // Activate Full Mode (Search, Filter, Export)
               />
            </div>
         </div>
      )}

      {currentSales.length === 0 && (
         <div className="bg-gray-50 dark:bg-[#18181b] rounded-xl p-8 text-center border border-dashed border-gray-300 dark:border-[#27272a] mb-8 transition-colors">
            <p className="text-gray-500 dark:text-gray-400">No hay ventas registradas en la caja abierta de hoy.</p>
         </div>
      )}

      <hr className="my-8 border-gray-200 dark:border-[#27272a]" />

      {/* 📜 Historial de Ventas Pasadas */}
      <div>
         <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Métricas Históricas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Resumen de rendimiento general</p>
         </div>
         
         <HistoricalStats />

         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 mt-8">Registro de Cajas Diarias</h3>
         <HistorySales />
      </div>

      <hr className="my-8 border-gray-200 dark:border-[#27272a]" />

      {/* 📒 Lista Completa de Ventas (Paginada) */}
      <div className="mb-12">
        
        <div className="flex justify-between items-end mb-4">
             <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                   <Receipt size={20} className="text-indigo-600 dark:text-indigo-400" />
                   Todas las Ventas
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Listado completo de transacciones.</p>
             </div>
             <div className="text-xs text-gray-400 dark:text-gray-500">
                Página {page} de {totalPages}
             </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-sm border border-gray-200 dark:border-[#27272a] p-4 transition-colors">
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
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#3f3f46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Página <span className="font-bold">{page}</span>
                        </span>
                        <button 
                            disabled={page >= totalPages}
                            onClick={() => fetchHistorySales(page + 1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#3f3f46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>

    </section>
  );
}
