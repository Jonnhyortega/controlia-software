"use client";

import { motion } from "framer-motion";
import React from "react";
import { ConfirmDialog } from "../confirmDialog";
import { Ban, Printer, Trash2 } from "lucide-react";
import { useCustomization } from "@/context/CustomizationContext";

interface SalesRowProps {
  sale: any;
  index: number;
  expanded: string | null;
  onExpand: (id: string) => void;
  onRevert: (id: string) => void;
  onShowReceipt?: (sale: any) => void;
}

export default function SalesRow({
  sale,
  index,
  expanded,
  onExpand,
  onRevert,
  onShowReceipt,
}: SalesRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { formatCurrency } = useCustomization();

  return (
    <>
      {/* FILA PRINCIPAL */}
      <tr
        key={sale._id}
        onClick={() => onExpand(sale._id)}
        className="hover:bg-gray-200 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer text-sm border-b border-transparent dark:border-[#27272a]"
      >
        <td className="hidden md:table-cell py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">
          #{index + 1}
        </td>

        <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {new Date(sale.createdAt).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>

        <td className="hidden md:table-cell py-3 px-4 capitalize text-primary dark:text-primary-300 font-medium">
          {sale.paymentMethod === 'cuenta corriente' ? (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded dark:bg-yellow-900 dark:text-yellow-300">
                  Cta. Cte.
              </span>
          ) : (
              sale.paymentMethod || "—"
          )}
        </td>

        <td className="hidden md:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
          <div className="truncate max-w-xs">
            {sale.products
              ?.map(
                (p: any) => `${p.product?.name || p.name} x${p.quantity}`
              )
              .join(", ")}
          </div>
        </td>

        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
          <div className="flex flex-col items-end">
            <span>{formatCurrency(sale.total)}</span>
            
            {/* Si hubo pago parcial o fiado, mostrar detalle */}
            {sale.amountDebt > 0 && (
              <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/10 px-1.5 py-0.5 rounded">
                Debe: {formatCurrency(sale.amountDebt)}
              </span>
            )}
             {/* Si pagó menos del total pero mayor a 0 */}
             {sale.amountPaid < sale.total && sale.amountPaid > 0 && (
              <span className="text-xs text-green-600 dark:text-green-400">
                Pagó: {formatCurrency(sale.amountPaid)}
              </span>
            )}
          </div>
        </td>

        <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
            {onShowReceipt && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowReceipt(sale);
                }}
                className="
                  text-blue-600 dark:text-blue-400 hover:text-white 
                  bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 
                  p-2 rounded-md transition
                  font-semibold
                  flex items-center justify-center gap-1
                "
                title="Ver Ticket"
              >
                <Printer size={14} />
                <span className="hidden md:inline text-xs">Ticket</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true); // ← Abrir confirm dialog
              }}
              className="
                text-red-600 dark:text-red-400 hover:text-white 
                bg-red-50 dark:bg-red-900/20 hover:bg-red-600 
                p-2 rounded-md transition
                font-semibold
                flex items-center justify-center gap-1
              "
              title="Anular venta"
            >
              <Trash2 size={14} />
              <span className="hidden md:inline text-xs">Anular</span>
            </button>
          </div>

          {isExpanded && (
            <ConfirmDialog
              open={isExpanded}
              message="¿Te gustaría anular la venta? No se puede revertir la acción."
              onConfirm={() => {
                onRevert(sale._id);
                setIsExpanded(false);
              }}
              onCancel={() => setIsExpanded(false)}
            />
          )}
          </td>

      </tr>

      {/* FILA EXPANDIDA */}
      {expanded === sale._id && (
        <tr className="bg-gray-200 dark:bg-[#0f0f0f] border-t border-gray-100 dark:border-[#27272a]">
          <td colSpan={6} className="py-3 px-4">

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-md border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] shadow-sm p-4"
            >
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                Detalles de la operación
              </h4>

              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {sale.products?.map((p: any, j: number) => (
                  <li
                    key={j}
                    className="flex justify-between border-b border-gray-100 dark:border-[#27272a] py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#1f1f1f]"
                  >
                    <small>#{j + 1}</small>

                    <span className="font-medium text-gray-900 dark:text-white">
                      {p.product?.name || p.name}
                    </span>

                    <span className="text-gray-600 dark:text-gray-400">
                      {p.quantity} ×{" "}
                      {formatCurrency(p.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </td>
        </tr>
      )}
    </>
  );
}
