import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { X, Upload, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "../button";
import Overlay from "../overlay";
import { createTransaction, updateTransaction } from "../../../../utils/transactions";
import { Transaction } from "../../../../types/api";
import { useToast } from "../../../../context/ToastContext";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "CLIENT_PAYMENT" | "SUPPLIER_PAYMENT" | "CLIENT_DEBT" | "SUPPLIER_DEBT";
  entityId: string; // Client ID or Supplier ID
  initialData?: Transaction; // For editing
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  type,
  entityId,
  initialData,
}: TransactionModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [initialPayment, setInitialPayment] = useState("");
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isDebtType = type.includes("DEBT");

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        description: initialData.description || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      });
      setPreviewUrl(initialData.imageUrl || null);
    } else {
      setFormData({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setFile(null);
      setPreviewUrl(null);
      setInitialPayment("");
      setShowPaymentInput(false);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return toast.error("Monto es requerido");
    if (showPaymentInput && Number(initialPayment) > Number(formData.amount)) {
        return toast.error("El pago inicial no puede ser mayor al monto total");
    }

    setLoading(true);
    try {
      // 1. Crear Transacción Principal (Deuda o Pago)
      const data = new FormData();
      data.append("type", type);
      data.append("amount", formData.amount);
      if (formData.description) data.append("description", formData.description);
      data.append("date", formData.date);

      if (type.includes("CLIENT")) {
        data.append("clientId", entityId);
      } else {
        data.append("supplierId", entityId);
      }

      if (file) {
        data.append("image", file);
      }

      if (initialData) {
        await updateTransaction(initialData._id, data);
        toast.success("Movimiento actualizado correctamente");
      } else {
         await createTransaction(data);
         
         // 2. Si es Deuda y hay Pago Inicial
         if (isDebtType && showPaymentInput && Number(initialPayment) > 0) {
             const paymentData = new FormData();
             // Invertir tipo: DEBT -> PAYMENT
             const paymentType = type === "CLIENT_DEBT" ? "CLIENT_PAYMENT" : "SUPPLIER_PAYMENT";
             paymentData.append("type", paymentType);
             paymentData.append("amount", initialPayment);
             paymentData.append("description", `Entrega inicial: ${formData.description || "Sin descripción"}`);
             paymentData.append("date", formData.date);
             
             if (type.includes("CLIENT")) {
                paymentData.append("clientId", entityId);
             } else {
                paymentData.append("supplierId", entityId);
             }
             
             // No adjuntamos la imagen al pago automático, se queda en la deuda
             await createTransaction(paymentData);
             toast.success("Deuda y Pago inicial registrados");
         } else {
             toast.success("Movimiento registrado correctamente");
         }
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el movimiento");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-md w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {initialData 
            ? "Editar Movimiento" 
            : type.includes("DEBT") 
              ? (type.includes("CLIENT") ? "Registrar Fiado / Cuenta Corriente" : "Registrar Pedido / Factura") 
              : "Registrar Pago"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isDebtType ? "Monto Total" : "Monto"}
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-zinc-900 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                placeholder="0.00"
              />
            </div>
            
            {/* INITIAL PAYMENT TOGGLE */}
            {!initialData && isDebtType && (
                <div className="mt-3">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input 
                            type="checkbox" 
                            checked={showPaymentInput}
                            onChange={(e) => setShowPaymentInput(e.target.checked)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary/20 border-gray-300"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Registrar Entrega / Pago Inicial</span>
                    </label>

                    {showPaymentInput && (
                        <div className="animate-in fade-in slide-in-from-top-1 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-md border border-emerald-100 dark:border-emerald-900/20">
                            <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Monto Abonado</label>
                            <div className="relative">
                                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max={formData.amount}
                                    value={initialPayment}
                                    onChange={(e) => setInitialPayment(e.target.value)}
                                    className="w-full pl-3 pr-8 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-700 dark:text-emerald-400 font-bold"
                                    placeholder="0.00"
                                />
                            </div>
                            {formData.amount && initialPayment && (
                                <p className="text-xs text-gray-500 mt-2 text-right">
                                    Saldo Restante: <span className="font-bold text-rose-500">${Math.max(0, Number(formData.amount) - Number(initialPayment)).toLocaleString('es-AR')}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
            <div className="relative">
              {/* <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> */}
               <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-zinc-900 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
            <div className="relative">
                <FileText className="absolute right-3 top-3 text-gray-400" size={18} />
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-zinc-900 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white resize-none"
                  placeholder="Detalles del pago..."
                />
            </div>
          </div>

          {/* Image Upload */}
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comprobante</label>
             <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md p-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-800/50 transition cursor-pointer relative">
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {previewUrl ? (
                    <div className="flex flex-col items-center">
                        <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-md mb-2" />
                        <p className="text-xs text-blue-500">Clic para cambiar</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm">Subir imagen o PDF</span>
                    </div>
                )}
             </div>
          </div>

          <div className="pt-4 flex gap-3">
             <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
             >
                Cancelar
             </Button>
             <Button
                type="submit"
                className="flex-1"
                disabled={loading}
             >
                {loading ? "Guardando..." : "Guardar"}
             </Button>
          </div>

        </form>
      </div>
    </Overlay>
  );
}
