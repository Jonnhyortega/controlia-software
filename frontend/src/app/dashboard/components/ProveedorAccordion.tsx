import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Package, Edit3, Trash2, History } from "lucide-react";

export function ProveedorAccordion({
  proveedor,
  productos,
  onEdit,
  onDelete,
  onHistory,
}: {
  proveedor: string;
  productos: any[];
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
  onHistory: (p: any) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border border-gray-200 dark:border-border bg-white dark:bg-background rounded-md overflow-hidden shadow-sm transition-colors">
      {/* Encabezado proveedor */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-200 hover:bg-gray-100 dark:bg-background dark:hover:bg-muted/10 transition font-semibold text-gray-800 dark:text-gray-200"
      >
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <span>{proveedor}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
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
            className="overflow-hidden overflow-x-auto"
          >
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-muted/20 text-gray-600 dark:text-gray-400 uppercase text-xs">
                  <th className="p-3 text-left">Nombre</th>
                  <th className="hidden md:table-cell p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="hidden md:table-cell p-3 text-left">Costo</th>
                  <th className="hidden md:table-cell p-3 text-left">Codigo</th>
                  <th className="hidden xl:table-cell p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-b border-gray-100 dark:border-border hover:bg-gray-200 dark:hover:bg-muted/10 transition ${p.stock === 0 ? "bg-red-50 dark:bg-red-900/20" : ""}`}
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="hidden md:table-cell p-3">{p.category}</td>
                    <td className="p-3">${p.price}</td>
                    <td className={`p-3 ${p.stock === 0 ? "font-bold text-red-600 dark:text-red-400" : ""}`}>{p.stock}</td>
                    <td className="hidden md:table-cell p-3">${p.cost}</td>
                    <td className="hidden md:table-cell p-3">#{p.barcode}</td>
                    <td className="hidden xl:table-cell p-3">
                      <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {onEdit(p)}}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onHistory(p)}
                        className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition"
                        title="Ver Historial"
                      >
                         <History className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      </div>
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
