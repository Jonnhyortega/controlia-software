"use client";

import { motion } from "framer-motion";
import React from "react";
import { ConfirmDialog } from "../confirmDialog";
import { Ban } from "lucide-react";

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

  return (
    <>
      {/* FILA PRINCIPAL */}
      <tr
        key={sale._id}
        onClick={() => onExpand(sale._id)}
        className="hover:bg-primary-50 transition-colors cursor-pointer"
      >
        <td className="hidden md:table-cell py-3 px-4 font-semibold text-gray-700">
          #{index + 1}
        </td>

        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
          {new Date(sale.createdAt).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>

        <td className="hidden md:table-cell py-3 px-4 capitalize text-primary-700 font-medium">
          {sale.paymentMethod || "—"}
        </td>

        <td className="hidden md:table-cell py-3 px-4 text-gray-700">
          <div className="truncate max-w-xs">
            {sale.products
              ?.map(
                (p: any) => `${p.product?.name || p.name} x${p.quantity}`
              )
              .join(", ")}
          </div>
        </td>

        <td className="py-3 px-4 text-right font-semibold text-gray-900">
          {sale.total.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
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
                  text-indigo-600 hover:text-white 
                  bg-indigo-100 hover:bg-indigo-500 
                  p-2 rounded-md transition
                  font-semibold
                  flex items-center justify-center
                "
                title="Ver Ticket"
              >
                <code className="text-xs mr-1 hidden md:inline">Ticket</code>
                {/* Icon if needed */}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true); // ← Abrir confirm dialog
              }}
              className="
                text-red-600 hover:text-white 
                bg-red-300 hover:bg-red-500 
                p-2 rounded-md transition
                font-semibold
                flex items-center justify-center
              "
              title="Anular venta"
            >
              <span className="hidden md:inline">Anular</span>
              <Ban className="w-4 h-4 md:hidden" />
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
        <tr className="bg-gray-50 border-y">
          <td colSpan={6} className="py-3 px-4">

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
            >
              <h4 className="font-semibold text-gray-800 mb-3">
                Detalles de la operación
              </h4>

              <ul className="space-y-1 text-sm text-gray-700">
                {sale.products?.map((p: any, j: number) => (
                  <li
                    key={j}
                    className="flex justify-between border-b border-gray-100 py-1 px-2 rounded-md hover:bg-gray-50"
                  >
                    <small>#{j + 1}</small>

                    <span className="font-medium text-gray-900">
                      {p.product?.name || p.name}
                    </span>

                    <span className="text-gray-600">
                      {p.quantity} ×{" "}
                      {p.price.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
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
