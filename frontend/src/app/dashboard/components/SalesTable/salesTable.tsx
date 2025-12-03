"use client";

import SalesRow from "./salesRow";

interface SalesTableProps {
  sales: any[];
  expanded: string | null;
  onExpand: (saleId: string) => void;
  onRevert: (saleId: string) => void;
}

export default function SalesTable({
  sales,
  expanded,
  onExpand,
  onRevert,
}: SalesTableProps) {
  return (
    <table className="w-full border border-gray-200 rounded-2xl overflow-hidden text-sm">
      <thead className="bg-primary-50 text-gray-700 border-b">
        <tr>
          <th className="py-3 px-4 text-left font-semibold">#</th>
          <th className="py-3 px-4 text-left font-semibold">Hora</th>
          <th className="py-3 px-4 text-left font-semibold">Método</th>
          <th className="py-3 px-4 text-left font-semibold">Productos</th>
          <th className="py-3 px-4 text-right font-semibold">Total</th>
          <th className="py-3 px-4 text-center font-semibold">Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {sales.map((sale, i) => (
          <SalesRow
            key={sale._id}
            sale={sale}
            index={sales.length - i - 1}
            expanded={expanded}
            onExpand={onExpand}
            onRevert={onRevert}
          />
        ))}
      </tbody>
    </table>
  );
}
