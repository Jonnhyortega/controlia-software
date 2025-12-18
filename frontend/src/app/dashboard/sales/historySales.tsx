"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Printer, Calendar, Search } from "lucide-react";
import { getClosedCashDays } from "../../../utils/api";
import { useCustomization } from "../../../context/CustomizationContext";
import ReceiptModal from "../components/SalesTable/ReceiptModal";
import { useAuth } from "../../../context/authContext";

// Helper Component for Metrics
function InfoCard({ title, value, color = "text-gray-900 dark:text-gray-100" }: { title: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col bg-gray-200 dark:bg-white/5 px-3 py-2 rounded-md border border-gray-100 dark:border-white/10">
      <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{title}</span>
      <span className={`font-bold text-sm md:text-base ${color}`}>{value}</span>
    </div>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function HistorySales() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Accordion states
  const [expandedId, setExpandedId] = useState<string | null>(null); // For Daily Items
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null); // For Month Groups

  const [selectedReceiptSale, setSelectedReceiptSale] = useState<any>(null);
  const { formatCurrency } = useCustomization();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      if (!user?._id) return;
      try {
        const data = await getClosedCashDays(user._id);
        const sorted = data.sort((a: any, b: any) => 
            new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
        );
        setHistory(sorted);

        // Auto-expand the newest month if available
        if (sorted.length > 0) {
             const date = new Date(sorted[0].date || sorted[0].createdAt || new Date().toISOString());
             const key = capitalize(date.toLocaleDateString("es-AR", { month: 'long', year: 'numeric' }));
             setExpandedMonth(key);
        }

      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
         setLoading(false);
      }
    })();
  }, [user]);

  const formatLocalTime = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  };

  const calculateTotalOut = (d: any) => {
    // Sum extra expenses + supplier payments if any
    const expenses = d.extraExpenses?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
    return expenses; 
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Cargando historial...</div>;
  if (!history.length) return <div className="py-8 text-center text-gray-500">No hay registros de cajas cerradas anteriores.</div>;

  // Filter logic
  const filteredHistory = history.filter(d => {
     const date = new Date(d.date || d.createdAt).toLocaleDateString("es-AR");
     return date.includes(searchTerm);
  });

  // Group by Month (using capitalized keys like "Diciembre 2025")
  const groupedHistory = filteredHistory.reduce((acc, d) => {
      const date = new Date(d.date || d.createdAt);
      const key = capitalize(date.toLocaleDateString("es-AR", { month: 'long', year: 'numeric' }));
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
      return acc;
  }, {} as Record<string, any[]>);

  const monthKeys = Object.keys(groupedHistory);

  return (
    <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-2 rounded-md w-full max-w-sm mb-6">
             <Search className="text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Buscar por fecha (DD/MM/AAAA)..." 
                className="w-full bg-transparent focus:outline-none text-sm dark:text-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
        </div>
        
        {monthKeys.length === 0 && <p className="text-gray-500 text-center py-4">No se encontraron resultados para la búsqueda.</p>}

        {monthKeys.map((month) => (
             <div key={month} className="border border-gray-200 dark:border-gray-700/50 rounded-md overflow-hidden bg-white/50 dark:bg-zinc-900/30 mb-6 shadow-sm">
                 
                 {/* 🗓 Month Header Accordion Filter */}
                 <div 
                   onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                   className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${expandedMonth === month ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'hover:bg-white dark:hover:bg-zinc-800/50'}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className="p-2.5 bg-primary/10 text-primary rounded-md">
                          <Calendar size={20} />
                       </div>
                       <div>
                           <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                                {month}
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                                    {groupedHistory[month].length} cierres
                                </span>
                           </h3>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">Historial Mensual</p>
                       </div>
                    </div>
                    <div className="text-gray-400">
                        {expandedMonth === month ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                 </div>

                 {/* Month Content - List of Days */}
                 <AnimatePresence>
                   {expandedMonth === month && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                        <div className="p-4 bg-gray-200/50 dark:bg-zinc-900/50 space-y-4 border-t border-gray-100 dark:border-gray-800">
                           {groupedHistory[month].map((d: any) => {
                                // Original Item Render Logic
                                const isExpanded = expandedId === d._id;
                                const dateLabel = new Date(d.date || d.createdAt).toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                
                                const totalSales = d.totalSalesAmount || 0;
                                const totalOut = calculateTotalOut(d);
                                const expected = (d.initialAmount || 0) + totalSales - totalOut;
                                const real = d.finalReal || 0;
                                const difference = real - expected;

                                return (
                                    <div key={d._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        
                                        {/* Day Card Header */}
                                        <div 
                                            onClick={() => setExpandedId(isExpanded ? null : d._id)}
                                            className="p-4 cursor-pointer flex flex-col md:flex-row gap-4 justify-between items-center hover:bg-gray-200 dark:hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className={`p-2 rounded-full ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{dateLabel}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {(d.totalOperations || d.sales?.length) ? 
                                                        `${d.totalOperations || d.sales?.length} ventas registradas` 
                                                        : <span className="text-transparent">.</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase text-gray-500 font-semibold">Total Ventas</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalSales)}</p>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] uppercase text-gray-500 font-semibold">Real en Caja</p>
                                                    <p className="font-bold text-primary">{formatCurrency(real)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Day Card Content (Expanded) */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-200/50 dark:bg-zinc-900/50">
                                                        
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                                            <InfoCard title="Ventas Totales" value={formatCurrency(totalSales)} color="text-primary-600 dark:text-primary-400" />
                                                            <InfoCard title="Gastos / Salidas" value={formatCurrency(totalOut)} color="text-red-500" />
                                                            <InfoCard title="Esperado en Caja" value={formatCurrency(expected)} />
                                                            <InfoCard 
                                                                title="Diferencia" 
                                                                value={formatCurrency(difference)} 
                                                                color={difference === 0 ? "text-green-500" : (difference > 0 ? "text-green-500" : "text-red-500")} 
                                                            />
                                                        </div>

                                                        {d.sales?.length > 0 ? (
                                                            <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-gray-200 dark:bg-zinc-800/50 text-gray-600 dark:text-gray-400 font-medium">
                                                                        <tr>
                                                                            <th className="py-3 px-4 text-left">Hora</th>
                                                                            <th className="py-3 px-4 text-left">Productos</th>
                                                                            <th className="py-3 px-4 text-left hidden sm:table-cell">Método</th>
                                                                            <th className="py-3 px-4 text-right">Total</th>
                                                                            <th className="py-3 px-4 text-center">Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                                                                        {d.sales.map((sale: any) => (
                                                                            <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition">
                                                                                <td className="py-3 px-4 whitespace-nowrap">{formatLocalTime(sale.createdAt)}</td>
                                                                                <td className="py-3 px-4 max-w-[150px] truncate" title={sale.products?.map((p:any) => p.product?.name || p.name).join(", ")}>
                                                                                    {sale.products?.length} items
                                                                                </td>
                                                                                <td className="py-3 px-4 hidden sm:table-cell capitalize">{sale.paymentMethod || "Efectivo"}</td>
                                                                                <td className="py-3 px-4 text-right font-medium">{formatCurrency(sale.total)}</td>
                                                                                <td className="py-3 px-4 text-center">
                                                                                    <button 
                                                                                        onClick={(e) => { e.stopPropagation(); setSelectedReceiptSale(sale); }}
                                                                                        className="p-1.5 text-indigo-600 hover:text-white hover:bg-indigo-500 rounded-md transition"
                                                                                        title="Ver Ticket"
                                                                                    >
                                                                                        <Printer size={16} />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-center text-gray-500 py-4">No hay detalles de ventas disponibles para esta fecha.</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                           })}
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
             </div>
        ))}
        
        {selectedReceiptSale && (
            <ReceiptModal 
                sale={selectedReceiptSale}
                onClose={() => setSelectedReceiptSale(null)}
            />
        )}
    </div>
  );
}
