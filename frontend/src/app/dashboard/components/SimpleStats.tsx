"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip, Legend } from "recharts";
import { useCustomization } from "@/context/CustomizationContext";

interface SimpleStatsProps {
  sales: any[];
}

const COLORS = ["#007bff", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function SimpleStats({ sales }: SimpleStatsProps) {
  const { formatCurrency, settings } = useCustomization();
  
  // 1. Agrupar ventas por hora (para gráfico de barras)
  const hourlyData = useMemo(() => {
    const hours = Array(24).fill(0);
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt); // Asumiendo createdAt ISO date
      const hour = date.getHours();
      hours[hour] += sale.total || 0;
    });

    return hours.map((amount, hour) => ({
      hour: `${hour}:00`,
      ventas: amount,
    })).filter(h => h.ventas > 0); 
  }, [sales]);

  // 2. Agrupar por método de pago (para gráfico de torta)
  const paymentData = useMemo(() => {
    const methods: Record<string, number> = {};
    sales.forEach((sale) => {
      const method = sale.paymentMethod || "Otros";
      methods[method] = (methods[method] || 0) + (sale.total || 0);
    });

    return Object.keys(methods).map((key) => ({
      name: key,
      value: methods[key],
    }));
  }, [sales]);

  if (sales.length === 0) return null;

  const barColor = settings?.primaryColor || "#3b82f6";

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      
      {/* Ventas por Hora */}
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2c2c2c] p-5 rounded-md shadow-lg">
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-4 text-sm uppercase tracking-wide">Ventas por Hora</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => formatCurrency(value)} 
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ 
                    backgroundColor: settings.theme === 'dark' ? '#1f1f1f' : '#fff', 
                    borderColor: settings.theme === 'dark' ? '#333' : '#eee', 
                    color: settings.theme === 'dark' ? '#fff' : '#000',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [formatCurrency(value), "Ventas"]}
              />
              <Bar dataKey="ventas" fill={barColor} radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métodos de Pago */}
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2c2c2c] p-5 rounded-md shadow-lg">
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-4 text-sm uppercase tracking-wide">Métodos de Pago</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: settings.theme === 'dark' ? '#1f1f1f' : '#fff', 
                    borderColor: settings.theme === 'dark' ? '#333' : '#eee', 
                    color: settings.theme === 'dark' ? '#fff' : '#000',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
                formatter={(value: number) => formatCurrency(value)} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
