import { motion } from "framer-motion";
import { TrendingUp, Clock, Receipt, ShoppingBag } from "lucide-react";

interface SalesStatsProps {
  sales: any[];
}

export default function SalesStats({ sales }: SalesStatsProps) {
  if (!sales || sales.length === 0) return null;

  // 1. Producto más vendido
  const productCounts: Record<string, number> = {};
  sales.forEach((sale) => {
    if (sale.products && Array.isArray(sale.products)) {
        sale.products.forEach((p: any) => {
            const name = p.product?.name || "Producto Manual";
            productCounts[name] = (productCounts[name] || 0) + p.quantity;
        });
    }
  });
  
  const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
  const topProductName = topProduct ? topProduct[0] : "N/A";
  const topProductCount = topProduct ? topProduct[1] : 0;

  // 2. Hora Pico
  const hourCounts: Record<string, number> = {};
  sales.forEach((sale) => {
    const date = new Date(sale.date || sale.createdAt); // Fallback
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const peakHourEntry = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  const peakHour = peakHourEntry ? `${peakHourEntry[0]}:00 hs` : "N/A";

  // 3. Ticket Promedio
  const totalAmount = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const avgTicket = totalAmount / sales.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0, 
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Producto Top */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#18181b] p-4 rounded-md border border-indigo-100 dark:border-indigo-900/30 shadow-sm flex items-center gap-4 transition-colors"
      >
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-md">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Más Vendido</p>
          <div className="flex items-baseline gap-2">
             <h4 className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-[150px]" title={topProductName}>
               {topProductName}
             </h4>
             <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
               x{topProductCount}
             </span>
          </div>
        </div>
      </motion.div>

      {/* Hora Pico */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#18181b] p-4 rounded-md border border-orange-100 dark:border-orange-900/30 shadow-sm flex items-center gap-4 transition-colors"
      >
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-md">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hora Pico</p>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{peakHour}</h4>
        </div>
      </motion.div>

      {/* Ticket Promedio */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#18181b] p-4 rounded-md border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex items-center gap-4 transition-colors"
      >
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">
          <Receipt size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ticket Promedio</p>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(avgTicket)}</h4>
        </div>
      </motion.div>

    </div>
  );
}
