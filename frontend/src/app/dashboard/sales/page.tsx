"use client";

import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import HistorySales from "./historySales";
import { useSales } from "../hooks/useSales";
import SalesStats from "../components/SalesTable/SalesStats";
import SalesTable from "../components/SalesTable/salesTable";
import HistoricalStats from "../components/SalesTable/HistoricalStats";
import { api } from "../../../utils/api";
import { useToast } from "../../../context/ToastContext";
import Loading from "../../../components/loading";

export default function VentasPage() {
  const { data, loading, reload } = useSales();
  const toast = useToast();
  const [expandedSale, setExpandedSale] = useState<string | null>(null);

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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h1>
          <p className="text-sm text-gray-500">
             Ventas del día actual y registros históricos.
          </p>
        </div>
      </div>

      {/* 📊 Estadísticas del Día */}
      {currentSales.length > 0 && (
         <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
               <Receipt size={20} className="text-primary" />
               Ventas de Hoy ({new Date().toLocaleDateString("es-AR")})
            </h2>
            <SalesStats sales={currentSales} />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
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
         <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300 mb-8">
            <p className="text-gray-500">No hay ventas registradas en la caja abierta de hoy.</p>
         </div>
      )}

      <hr className="my-8 border-gray-200" />

      {/* 📜 Historial de Ventas Pasadas */}
      <div>
         <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Métricas Históricas</h2>
            <p className="text-sm text-gray-500">Resumen de rendimiento general</p>
         </div>
         
         <HistoricalStats />

         <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Registro de Cajas Diarias</h3>
         <HistorySales />
      </div>

    </section>
  );
}
