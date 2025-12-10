import { useEffect, useState } from "react";
import { getProductHistory } from "../../../../utils/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Overlay from "../../components/overlay";
import { History, X, User } from "lucide-react";

interface ProductHistoryModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

interface HistoryEntry {
  _id: string;
  action: "create" | "update" | "delete";
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  changes: Record<string, { old: any; new: any }>;
  createdAt: string;
}

export function ProductHistoryModal({ productId, productName, onClose }: ProductHistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getProductHistory(productId);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [productId]);

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create": return "Creación";
      case "update": return "Modificación";
      case "delete": return "Eliminación";
      default: return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "text-green-500 bg-green-500/10";
      case "update": return "text-blue-500 bg-blue-500/10";
      case "delete": return "text-red-500 bg-red-500/10";
      default: return "text-gray-500";
    }
  };

  const formatValue = (val: any) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "boolean") return val ? "Sí" : "No";
    return val.toString();
  };

  const mapFieldName = (key: string) => {
      const map: Record<string, string> = {
          name: "Nombre",
          price: "Precio",
          stock: "Stock",
          cost: "Costo",
          category: "Categoría",
          barcode: "Código de Barras",
          description: "Descripción",
          supplier: "Proveedor",
          imageUrl: "Imagen"
      };
      return map[key] || key;
  }

  return (
    <Overlay>
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-[#333]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-[#1a1a1a] rounded-t-2xl z-10">
          <div>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="text-primary" size={24} />
                Historial de Cambios
             </h2>
             <p className="text-sm text-gray-400 mt-1">
                Producto: <span className="text-white font-medium">{productName}</span>
             </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#333] rounded-full text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
               <History size={48} className="mx-auto mb-3 opacity-20" />
               <p>No hay historial de cambios registrado para este producto.</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              {history.map((entry) => (
                <div key={entry._id} className="relative flex items-start group">
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 mt-1.5 ml-2.5 h-5 w-5 rounded-full border-4 border-[#1a1a1a] ${getActionColor(entry.action).replace("/10","")} z-10 md:mx-auto`}></div>

                  <div className="ml-10 w-full bg-[#242424] rounded-xl border border-[#333] p-4 hover:border-primary/30 transition-colors">
                    
                    {/* Header Item */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-gray-400">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {entry.user?.name || "Usuario Desconocido"}
                                    <span className="text-xs text-gray-500 ml-2 font-normal">({entry.user?.role || "N/A"})</span>
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionColor(entry.action)}`}>
                                    {getActionLabel(entry.action)}
                                </span>
                            </div>
                        </div>
                        <time className="text-xs text-gray-500 whitespace-nowrap">
                            {format(new Date(entry.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                        </time>
                    </div>

                    {/* Changes List */}
                    {Object.keys(entry.changes || {}).length > 0 && (
                      <div className="mt-3 bg-[#111] rounded-lg p-3 text-sm space-y-2 border border-[#333]">
                        {Object.entries(entry.changes).map(([field, change]) => (
                            <div key={field} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-[#222] last:border-0 pb-1 last:pb-0">
                                <span className="text-gray-400 font-medium capitalize">{mapFieldName(field)}:</span>
                                <div className="text-gray-300 flex items-center gap-2">
                                    <span className="line-through text-red-400/70 text-xs">{formatValue(change.old)}</span>
                                    <span className="text-gray-600">→</span>
                                    <span className="text-green-400 font-semibold">{formatValue(change.new)}</span>
                                </div>
                            </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Creation Fallback */}
                    {entry.action === "create" && Object.keys(entry.changes || {}).length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">Producto creado.</p>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
}
