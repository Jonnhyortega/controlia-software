"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { closeDailyCashById } from "../../../utils/api";
import OverlayNotification from "../../../components/overlayNotification";
import { Undo2 } from "lucide-react";

export default function CloseCashForm({
  cashId,
  onBack,
  onClosed,
}: {
  cashId: string;
  onBack: () => void;
  onClosed?: () => void;
}) {
  const [extraExpenses, setExpenses] = useState([
    { description: "", amount: 0 },
  ]);

  const [supplierPayments, setPayments] = useState([
    { metodo: "efectivo", total: 0 },
  ]);

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // ➕ Añadir gasto dinámicamente
  const handleAddExpense = () =>
    setExpenses([...extraExpenses, { description: "", amount: 0 }]);

  // ➕ Añadir pago dinámico
  const handleAddPayment = () =>
    setPayments([...supplierPayments, { metodo: "efectivo", total: 0 }]);

  // 📌 Handler para inputs dinámicos
  const handleChange = (
    arr: any[],
    setFn: any,
    i: number,
    field: string,
    value: any
  ) => {
    const updated = [...arr];
    updated[i][field] = value;
    setFn(updated);
  };

  // 🛑 Validaciones
  const validateForm = () => {
    // Validar gastos
    for (const [i, exp] of extraExpenses.entries()) {
      const filled = exp.description.trim() || exp.amount > 0;
      if (filled && (!exp.description.trim() || exp.amount <= 0)) {
        return `El gasto #${i + 1} debe tener descripción y monto válido.`;
      }
    }

    // Validar pagos
    for (const [i, pay] of supplierPayments.entries()) {
      if (pay.total > 0 && (!pay.metodo.trim() || pay.total <= 0)) {
        return `El pago #${i + 1} debe tener método y monto válido.`;
      }
    }

    return null;
  };

  // 🟢 SUBMIT — ahora cierra caja por ID
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);

    const validationError = validateForm();
    if (validationError) {
      setResponse({ success: false, message: validationError });
      setShowOverlay(true);
      return;
    }

    setLoading(true);

    try {
      // 👇 Usamos cierre POR ID
      const res = await closeDailyCashById(cashId, {
        extraExpenses,
        supplierPayments,
      });

      setResponse(res);
      setShowOverlay(true);

      // Avisar al padre si se cerró OK
      if (res.success && onClosed) {
        onClosed();
      }
    } catch (error: any) {
      console.error("❌ Error inesperado al cerrar caja:", error);

      setResponse({
        success: false,
        message: "Error desconocido al intentar cerrar caja.",
        data: null,
      });

      setShowOverlay(true);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================================
  //                       RENDER DEL FORMULARIO
  // ======================================================================
  return (
    <>
      {/* 🔔 Overlay de éxito/error */}
      <OverlayNotification
        type={response?.success ? "success" : "error"}
        message={response?.message || ""}
        show={showOverlay}
        onClose={() => setShowOverlay(false)}
      />

      {/* 📦 Contenedor del form */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6"
      >
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Cerrar caja del día
          </h3>

          <button
            onClick={onBack}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <Undo2 />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🟣 GASTOS */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2">
              Gastos extras
            </h4>

            {extraExpenses.map((e, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={e.description}
                  onChange={(ev) =>
                    handleChange(
                      extraExpenses,
                      setExpenses,
                      i,
                      "description",
                      ev.target.value
                    )
                  }
                  className="border p-2 rounded w-2/3"
                />

                <input
                  type="number"
                  placeholder="Monto"
                  value={e.amount}
                  onChange={(ev) =>
                    handleChange(
                      extraExpenses,
                      setExpenses,
                      i,
                      "amount",
                      Number(ev.target.value)
                    )
                  }
                  className="border p-2 rounded w-1/3"
                  min={0}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddExpense}
              className="text-primary-300 text-sm"
            >
              + Agregar gasto
            </button>
          </section>

          {/* 🟡 PAGOS A PROVEEDORES */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2">
              Pagos a proveedores
            </h4>

            {supplierPayments.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select
                  value={p.metodo}
                  onChange={(ev) =>
                    handleChange(
                      supplierPayments,
                      setPayments,
                      i,
                      "metodo",
                      ev.target.value
                    )
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
                  value={p.total}
                  onChange={(ev) =>
                    handleChange(
                      supplierPayments,
                      setPayments,
                      i,
                      "total",
                      Number(ev.target.value)
                    )
                  }
                  className="border p-2 rounded w-1/3"
                  min={0}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPayment}
              className="text-primary-300 text-sm"
            >
              + Agregar pago
            </button>
          </section>

          {/* 🟢 BOTÓN CERRAR */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {loading ? "Cerrando..." : "Cerrar caja"}
          </button>
        </form>

        {/* 🧾 RESULTADO */}
        {response && (
          <div
            className={`
              mt-6 border-t pt-4 text-sm rounded-lg p-4
              ${
                response?.success
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }
            `}
          >
            <p className="font-semibold">
              {response?.message || "Respuesta recibida del servidor."}
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
