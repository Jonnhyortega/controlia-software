"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Undo2 } from "lucide-react";
import OverlayNotification from "../../../../components/overlayNotification"; 
import { closeDailyCashById } from "../../../../utils/api";

interface CloseCashFormProps {
  cashId: string;
  onBack: () => void;
  onClosed?: () => void;
}

export default function CloseCashForm({
  cashId,
  onBack,
  onClosed,
}: CloseCashFormProps) {
  const [extraExpenses, setExtraExpenses] = useState([
    { description: "", amount: 0 },
  ]);
  const [supplierPayments, setSupplierPayments] = useState([
    { metodo: "efectivo", total: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // ============================================
  //            HANDLERS
  // ============================================

  const handleChange = (
    arr: any[],
    setter: any,
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...arr];
    updated[index][field] = value;
    setter(updated);
  };

  const addExpense = () =>
    setExtraExpenses([...extraExpenses, { description: "", amount: 0 }]);

  const addPayment = () =>
    setSupplierPayments([...supplierPayments, { metodo: "efectivo", total: 0 }]);

  // ============================================
  //            VALIDACIÓN
  // ============================================



  const validateForm = () => {
    for (const [i, exp] of extraExpenses.entries()) {
      const filled = exp.description.trim() || exp.amount > 0;
      if (filled && (!exp.description.trim() || exp.amount <= 0)) {
        return `El gasto #${i + 1} debe tener descripción y monto válido.`;
      }
    }

    for (const [i, pay] of supplierPayments.entries()) {
      if (pay.total > 0 && (!pay.metodo.trim() || pay.total <= 0)) {
        return `El pago #${i + 1} debe tener método y monto válido.`;
      }
    }

    return null;
  };

  // ============================================
  //            SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);

    const error = validateForm();
    if (error) {
      setResponse({ success: false, message: error });
      setShowOverlay(true);
      return;
    }

    setLoading(true);

    try {
      const res = await closeDailyCashById(cashId, {
        extraExpenses,
        supplierPayments,
      });

      setResponse(res);
      setShowOverlay(true);

      if (res.success && onClosed) onClosed();
    } catch (err) {
      console.error("❌ Error al cerrar caja:", err);
      setResponse({
        success: false,
        message: "Error desconocido al intentar cerrar caja.",
      });
      setShowOverlay(true);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  //            RENDER
  // ============================================

  return (
    <>
      {/* OVERLAY DE ÉXITO / ERROR */}
      <OverlayNotification
        type={response?.success ? "success" : "error"}
        message={response?.message || ""}
        show={showOverlay}
        onClose={() => setShowOverlay(false)}
      />

      {/* FORMULARIO */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 max-w-xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-gray-900">
            Cerrar caja del día
          </h3>

          <button
            onClick={onBack}
            className="p-2 border rounded-lg hover:bg-gray-100 transition"
          >
            <Undo2 size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ---------------------- GASTOS ---------------------- */}
          <section>
            <h4 className="font-medium text-gray-700 mb-2">Gastos extras</h4>

            {extraExpenses.map((item, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(extraExpenses, setExtraExpenses, i, "description", e.target.value)
                  }
                  className="border p-2 rounded w-2/3"
                />

                <input
                  type="number"
                  placeholder="Monto"
                  value={item.amount}
                  min={0}
                  onChange={(e) =>
                    handleChange(extraExpenses, setExtraExpenses, i, "amount", Number(e.target.value))
                  }
                  className="border p-2 rounded w-1/3"
                />
              </div>
            ))}

            <button
              type="button"
              className="text-primary-600 text-sm"
              onClick={addExpense}
            >
              + Agregar gasto
            </button>
          </section>

          {/* ---------------------- PAGOS ---------------------- */}
          <section>
            <h4 className="font-medium text-gray-700 mb-2">
              Pagos a proveedores
            </h4>

            {supplierPayments.map((item, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <select
                  value={item.metodo}
                  onChange={(e) =>
                    handleChange(supplierPayments, setSupplierPayments, i, "metodo", e.target.value)
                  }
                  className="border p-2 rounded w-1/3"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mercado pago">Mercado Pago</option>
                  <option value="otro">Otro</option>
                </select>

                <input
                  type="number"
                  placeholder="Monto"
                  value={item.total}
                  min={0}
                  onChange={(e) =>
                    handleChange(supplierPayments, setSupplierPayments, i, "total", Number(e.target.value))
                  }
                  className="border p-2 rounded w-1/3"
                />
              </div>
            ))}

            <button
              type="button"
              className="text-primary-600 text-sm"
              onClick={addPayment}
            >
              + Agregar pago
            </button>
          </section>

          {/* ---------------- BOTÓN SUBMIT ---------------- */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg w-full transition"
          >
            {loading ? "Cerrando..." : "Cerrar caja"}
          </button>
        </form>
      </motion.div>
    </>
  );
}
