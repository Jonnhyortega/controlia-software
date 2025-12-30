"use client";

import { Trash2 } from "lucide-react";
import { useCustomization } from "@/context/CustomizationContext";
import { useAuth } from "@/context/authContext";

interface ExpensesTableProps {
  expenses: { description: string; amount: number }[];
  onDelete: (index: number) => void;
}

export default function ExpensesTable({ expenses, onDelete }: ExpensesTableProps) {
  const { formatCurrency } = useCustomization();
  const { user } = useAuth();
  
  if (!expenses || expenses.length === 0) return null;
  
  return (
    <div className="mt-8 mb-8 ">
      {/* <div className="flex items-center gap-2 mb-4 px-1">
        <div className="p-1.5 rounded-md">
           <ArrowDownRight className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gastos y Salidas</h3>
      </div>
       */}
      <div className="border border-gray-200 dark:border-[#27272a] rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="dark:bg-background bg-white text-gray-700 border-b border-gray-100 dark:border-zinc-800">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-gray-900 dark:text-gray-500">Descripción</th>
              <th className="py-3 px-6 text-right font-semibold text-gray-900 dark:text-gray-500">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:bg-background bg-white">
            {expenses.map((expense, i) => (
              <tr key={i} className="hover:bg-gray-200 dark:hover:bg-[#1f1f1f] transition-colors">
                <td className="py-3 px-6 text-gray-700 font-medium">
                  {expense.description}
                </td>
                <td className="py-3 px-6 text-right font-bold text-red-600 flex items-center justify-end gap-3">
                  - {formatCurrency(expense.amount)}
                  {user?.role === "admin" && 
                   !(expense as any).isTransaction && 
                   !expense.description.toLowerCase().startsWith("pago a proveedor") && (
                    <button 
                      onClick={() => onDelete(i)}
                      className="p-1.5 rounded-md transition-colors hidden md:inline-flex text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Eliminar gasto"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
