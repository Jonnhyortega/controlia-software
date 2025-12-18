"use client";

import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import SalesRow from "./salesRow";
import ReceiptModal from "./ReceiptModal";

interface SalesTableProps {
  sales: any[];
  expanded: string | null;
  onExpand: (saleId: string) => void;
  onRevert: (saleId: string) => void;
  simpleMode?: boolean;
}

export default function SalesTable({
  sales,
  expanded,
  onExpand,
  onRevert,
  simpleMode = false,
}: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<any>(null);

  // 🔍 Filtrar ventas
  const filteredSales = sales.filter((sale) => {
    // En modo simple, no filtramos (o podríamos limitar cantidad)
    if (simpleMode) return true;

    // Filtro por método de pago
    if (filterMethod !== "all" && sale.paymentMethod?.toLowerCase() !== filterMethod.toLowerCase()) {
      return false;
    }

    // Filtro por búsqueda (Nombre producto)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      // Ver si algún producto coincide
      const hasProduct = sale.products?.some((p: any) => {
         const name = p.product?.name || p.name || "";
         return name.toLowerCase().includes(term);
      });
      // O si el ID coincide (últimos caracteres)
      const matchesId = sale._id.slice(-6).toLowerCase().includes(term);
      
      return hasProduct || matchesId;
    }

    return true;
  });

  // 📥 Exportar a CSV
  const handleExport = () => {
    if (!filteredSales.length) return;

    const headers = ["Fecha", "ID Venta", "Método Pago", "Productos", "Total"];
    const rows = filteredSales.map(sale => {
       const date = new Date(sale.date || sale.createdAt).toLocaleDateString("es-AR") + " " + new Date(sale.date || sale.createdAt).toLocaleTimeString("es-AR");
       const products = sale.products.map((p: any) => `${p.quantity}x ${p.product?.name || "Manual"}`).join(" | ");
       return [
         date, 
         sale._id, 
         sale.paymentMethod || "Desconocido", 
         `"${products}"`, // Quote to handle commas
         sale.total
       ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* 🛠️ Barra de Herramientas (Solo si NO es simpleMode) */}
      {!simpleMode && (
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-gray-200 dark:bg-[#18181b] p-3 rounded-md border border-gray-200 dark:border-[#27272a] transition-colors">
          
          {/* Buscador */}
          <div className="relative w-full md:w-auto flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar producto o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
              {/* Filtro Método */}
              <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select 
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="pl-9 pr-8 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer"
                  >
                      <option value="all" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Todos los métodos</option>
                      <option value="efectivo" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Efectivo</option>
                      <option value="tarjeta" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Tarjeta</option>
                      <option value="transferencia" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Transferencia</option>
                      <option value="mercado pago" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Mercado Pago</option>
                      <option value="otro" className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">Otro</option>
                  </select>
              </div>

              {/* Exportar */}
              <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#3f3f46] rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition"
              >
                  <Download size={16} />
                  <span className="hidden sm:inline">Exportar</span>
              </button>
          </div>
        </div>
      )}

      {/* 📋 Tabla */}
      <div className="border border-gray-200 dark:border-[#27272a] rounded-md overflow-hidden transition-colors">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 dark:bg-[#09090b] text-gray-700 dark:text-gray-200 border-b dark:border-[#27272a]">
            <tr>
              <th className="hidden md:table-cell py-3 px-4 text-left font-semibold">#</th>
              <th className="py-3 px-4 text-left font-semibold">Fecha y hora</th>
              <th className="hidden md:table-cell py-3 px-4 text-left font-semibold">Método</th>
              <th className="hidden md:table-cell py-3 px-4 text-left font-semibold">Productos</th>
              <th className="py-3 px-4 text-right font-semibold">Total</th>
              <th className="py-3 px-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-[#27272a] bg-white dark:bg-[#18181b]">
            {filteredSales.length > 0 ? (
                filteredSales.map((sale, i) => (
                <SalesRow
                    key={sale._id}
                    sale={sale}
                    index={filteredSales.length - i - 1} // Index visual
                    expanded={expanded}
                    onExpand={onExpand}
                    onRevert={onRevert}
                    onShowReceipt={(sale) => setSelectedReceiptSale(sale)}
                />
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                        No se encontraron ventas con estos filtros.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 🧾 Modal Ticket */}
      {selectedReceiptSale && (
          <ReceiptModal 
            sale={selectedReceiptSale} 
            onClose={() => setSelectedReceiptSale(null)} 
          />
      )}

    </div>
  );
}
