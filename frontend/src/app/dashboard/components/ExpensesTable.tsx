"use client";

import { ArrowDownRight } from "lucide-react";

interface ExpensesTableProps {
  expenses: { description: string; amount: number }[];
}

export default function ExpensesTable({ expenses }: ExpensesTableProps) {
  if (!expenses || expenses.length === 0) return null;
  console.log(expenses)
  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="p-1.5 bg-red-100 rounded-lg">
           <ArrowDownRight className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Gastos y Salidas</h3>
      </div>
      
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Descripción</th>
              <th className="py-3 px-6 text-right font-semibold">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {expenses.map((expense, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-6 text-gray-700 font-medium">
                  {expense.description}
                </td>
                <td className="py-3 px-6 text-right font-bold text-red-600">
                  - ${expense.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
