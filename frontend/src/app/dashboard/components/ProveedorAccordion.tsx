"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Package, Edit3, Trash2 } from "lucide-react";

export function ProveedorAccordion({
  proveedor,
  productos,
  onEdit,
  onDelete,
}: {
  proveedor: string;
  productos: any[];
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border border-red-800 bg-blend-color rounded-2xl overflow-hidden shadow-sm">
      {/* Encabezado proveedor */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition font-semibold text-gray-800"
      >
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <span>{proveedor}</span>
          <span className="text-sm text-gray-500 ml-2">
            ({productos.length} productos)
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Lista animada */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Costo</th>
                  <th className="p-3 text-left">Codigo</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${p.stock === 0 ? "bg-red-100" : ""}`}
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">${p.price}</td>
                    <td className={`p-3 ${p.stock === 0 ? "font-bold text-red-600" : ""}`}>{p.stock}</td>
                    <td className="p-3">${p.cost}</td>
                    <td className="p-3">#{p.barcode}</td>
                    <td className="p-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() => {onEdit(p)}}
                        className="text-primary-300 hover:text-primary-700 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
