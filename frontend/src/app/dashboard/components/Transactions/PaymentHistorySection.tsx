import { useEffect, useState } from "react";
import { Transaction } from "../../../../types/api";
import { getTransactions, deleteTransaction } from "../../../../utils/transactions";
import { Edit2, Trash2, FileText, CheckCircle2, User, ExternalLink, Plus } from "lucide-react";
import TransactionModal from "./TransactionModal";
import { useAuth } from "../../../../context/authContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "../../../../context/ToastContext";
import { ConfirmDialog } from "../confirmDialog";

interface PaymentHistorySectionProps {
  context: "CLIENT" | "SUPPLIER";
  entityId: string;
  refreshParent?: () => void;
}

export default function PaymentHistorySection({ context, entityId, refreshParent }: PaymentHistorySectionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"CLIENT_PAYMENT" | "SUPPLIER_PAYMENT" | "CLIENT_DEBT" | "SUPPLIER_DEBT">("CLIENT_PAYMENT");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: () => {},
        onCancel: () => {},
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = context === "CLIENT" ? { clientId: entityId } : { supplierId: entityId };
      const data = await getTransactions(params);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) fetchTransactions();
  }, [entityId, context]);

  const handleDelete = (id: string) => {
    setConfirmDialog({
        open: true,
        title: "Eliminar movimiento",
        message: "¿Estás seguro de eliminar este movimiento? Se revertirá el saldo.",
        onConfirm: async () => {
             setConfirmDialog((prev) => ({ ...prev, open: false }));
             try {
                await deleteTransaction(id);
                toast.success("Movimiento eliminado y saldo revertido");
                fetchTransactions();
                refreshParent?.();
            } catch (error) {
                console.error(error);
                toast.error("Error al eliminar movimiento");
            }
        },
        onCancel: () => setConfirmDialog((prev) => ({ ...prev, open: false })),
    });
  }

  const openModal = (type: "PAYMENT" | "DEBT", transaction?: Transaction) => {
    setEditingTransaction(transaction);
    if (transaction) {
        setModalType(transaction.type);
    } else {
        if (context === "CLIENT") {
            setModalType(type === "PAYMENT" ? "CLIENT_PAYMENT" : "CLIENT_DEBT");
        } else {
            setModalType(type === "PAYMENT" ? "SUPPLIER_PAYMENT" : "SUPPLIER_DEBT");
        }
    }
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={20} />
            Cuenta Corriente
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
             <button
                onClick={() => openModal("DEBT")}
                className="flex-1 sm:flex-none text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 transition shadow-sm"
            >
                <Plus size={16} /> {context === "CLIENT" ? "Agregar Fiado/Deuda" : "Registrar Pedido"}
            </button>
            <button
                onClick={() => openModal("PAYMENT")}
                className="flex-1 sm:flex-none text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 transition shadow-sm"
            >
                <Plus size={16} /> {context === "CLIENT" ? "Registrar Cobro" : "Registrar Pago"}
            </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">Cargando historial...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-gray-200 dark:bg-zinc-800/50 rounded-md border border-dashed border-gray-200 dark:border-gray-700">
           <p className="text-sm">No hay movimientos registrados aún.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-md shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-200 dark:bg-zinc-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3 text-center">Comprobante</th>
                 <th className="px-4 py-3">Usuario</th>
                {isAdmin && <th className="px-4 py-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isDebt = tx.type === "CLIENT_DEBT" || tx.type === "SUPPLIER_DEBT";
                return (
                    <tr key={tx._id} className="bg-white dark:bg-zinc-900 border-b last:border-0 border-gray-50 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-zinc-800/50 transition">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {format(new Date(tx.date), "dd/MM/yyyy", { locale: es })}
                      </td>
                       <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isDebt ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30" : "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30"}`}>
                            {isDebt ? (context === "CLIENT" ? "FIADO" : "PEDIDO") : "PAGO"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 max-w-[200px] truncate">
                        {tx.description || <span className="text-gray-400 italic">Sin descripción</span>}
                      </td>
                      <td className={`px-4 py-3 font-mono font-bold text-right ${isDebt ? "text-rose-500" : "text-emerald-600"}`}>
                        {isDebt ? "+" : "-"}${new Intl.NumberFormat("es-AR").format(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tx.imageUrl ? (
                            <a 
                                href={tx.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline"
                            >
                                <FileText size={14} /> Ver
                            </a>
                        ) : (
                            <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <div className="flex items-center gap-1.5" title={(tx.createdBy as any)?.name}>
                            <User size={14} />
                            <span className="truncate max-w-[80px]">{(tx.createdBy as any)?.name?.split(" ")[0] || "Sistema"}</span>
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                           <div className="flex justify-end gap-1">
                              <button
                                 onClick={() => openModal(tx.type.includes("DEBT") ? "DEBT" : "PAYMENT", tx)} 
                                 className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                              >
                                 <Edit2 size={14} />
                              </button>
                              <button 
                                 onClick={() => handleDelete(tx._id)}
                                 className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                              >
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </td>
                      )}
                    </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />

      {/* MODAL */}
      {modalOpen && (
        <TransactionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { fetchTransactions(); refreshParent?.(); }}
          type={modalType}
          entityId={entityId}
          initialData={editingTransaction}
        />
      )}
    </div>
  );
}
