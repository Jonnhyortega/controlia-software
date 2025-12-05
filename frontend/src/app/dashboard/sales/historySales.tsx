"use client";

import { useState, useEffect } from "react";
import {
  getDailyCashByDate,
  getClosedCashDays,
} from "../../../utils/api";

import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Lock,
} from "lucide-react";

import { formatLocalDate, formatLocalTime } from "../../../utils/dateUtils";
import InfoCard from "../components/infoCard";
import Loading from "../../../components/loading";
import { AnimatePresence, motion } from "framer-motion";
import CloseCashForm from "../components/CloseCashForm";
import { useToast } from "../../../context/ToastContext";

export default function HistorySales() {
  const toast = useToast();

  const [showCloseCashForm, setShowCloseCashForm] = useState(false);
  const [selectedCash, setSelectedCash] = useState<any>(null);
  const [dates, setDates] = useState<any[]>([]);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const days = await getClosedCashDays();

        const sorted = [...days].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setDates(sorted);
      } catch (err) {
        console.error("Error al obtener días:", err);
        toast.error("Error al obtener días ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchDays();
  }, []);

  const truncate = (str: string, max = 35) => {
  return str.length > max ? str.slice(0, max) + "…" : str;
  };

  const formatProductsTooltip = (products: any[]) => {
  return products
    .map((p) => `${p.product?.name || p.name} x${p.quantity}`)
    .join("\n");
  };



  const toggleDate = async (date: string) => {
    if (openDate === date) return setOpenDate(null);

    if (!salesData[date]) {
      try {
        const data = await getDailyCashByDate(date);
        setSalesData((prev) => ({ ...prev, [date]: data }));
      } catch (err: any) {
        // Si es 404 o "No se encontró", simplemente no hay datos para ese día
        if (err.message?.includes("No se encontró") || err.response?.status === 404) {
             setSalesData((prev) => ({ ...prev, [date]: null }));
        } else {
             console.error("Error al obtener ventas:", err);
             toast.error("Error al cargar ventas ❌");
        }
      }
    }

    setOpenDate(date);
  };

  if (loading) return <Loading />;

  return (
    <section className="w-full flex justify-center px-3 sm:px-6 py-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="font-display text-lg sm:text-xl font-semibold text-primary mb-6">
            Historial de cajas diarias
          </h2>

          {dates.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No hay registros 📭
            </p>
          ) : (
            dates.map((d) => {
              const date = new Date(d.date).toLocaleDateString("en-CA");
              const daily = salesData[date];
              const isOpen = openDate === date;

              return (
                <div
                  key={date}
                  className="mb-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* HEADER */}
                  <button
                    onClick={() => toggleDate(date)}
                    className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 transition-all text-left
                      ${
                        d.status === "cerrada"
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-amber-50 hover:bg-amber-100"
                      }
                    `}
                  >
                    {/* FECHA */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {formatLocalDate(d.date)}
                      </span>
                      <p
                        className={`text-xs ${
                          d.status === "cerrada"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {d.status === "cerrada" ? "Cerrada" : "Abierta"}
                      </p>
                    </div>

                    {/* MÉTRICAS (WRAP EN MOBILE) */}
                    <div className="flex flex-wrap items-center gap-3 text-sm sm:text-xs md:text-sm">

                      <span className="hidden md:flex items-center gap-1 text-primary-300 whitespace-nowrap">
                        <DollarSign size={16} strokeWidth={3} />
                        {d.totalSalesAmount.toLocaleString("es-AR")}
                      </span>

                      <span className="hidden md:flex items-center gap-1 text-red-500 whitespace-nowrap">
                        -<DollarSign size={16} strokeWidth={3} />
                        {d.totalOut.toLocaleString("es-AR")}
                      </span>

                      <span className="hidden md:flex items-center  gap-1 text-green-600 whitespace-nowrap">
                        <TrendingUp size={16} strokeWidth={3} />
                        {d.finalExpected.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>

                      {d.status === "abierta" && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCash(d);
                            setShowCloseCashForm(true);
                          }}
                          className="
                            flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm 
                            text-amber-700 bg-amber-100 border border-amber-300 
                            rounded-lg hover:bg-amber-200 cursor-pointer whitespace-nowrap
                          "
                        >
                          <Lock size={14} /> Cerrar caja
                        </div>
                      )}

                      {isOpen ? (
                        <ChevronUp className="text-gray-500" />
                      ) : (
                        <ChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* CUERPO EXPANDIBLE */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden bg-white border-t"
                      >
                        <div className="p-4 sm:p-5 space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard
                              title="Ventas"
                              value={d.totalSalesAmount.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                            />
                            <InfoCard
                              title="Gastos y pagos"
                              value={d.totalOut.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                            />
                            <InfoCard
                              title="Esperado"
                              value={d.finalExpected.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                            />
                            <InfoCard
                              title="Diferencia"
                              value={d.difference.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                              color={d.difference === 0 ? "text-green-600" : "text-red-600"}
                            />
                          </div>

                          {daily && (
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <ShoppingCart size={18} /> Ventas
                              </h3>

                              <div className="overflow-x-auto rounded-xl border bg-white">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-100 border-b text-gray-700">
                                    <tr>
                                      <th className="p-2">Hora</th>
                                      <th className="p-2">Productos</th>
                                      <th className="p-2">Método</th>
                                      <th className="p-2 text-right">Total</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {daily.sales.map((sale: any) => (
                                      <tr key={sale._id} className="border-t">
                                        <td className="p-4">{formatLocalTime(sale.createdAt)}</td>
                                        <td
                                          className="p-4 max-w-[250px] truncate cursor-help"
                                          title={formatProductsTooltip(sale.products)}
                                          style={{ whiteSpace: "pre-line" }} // Permite saltos de línea en el tooltip
                                        >
                                          {truncate(
                                            sale.products
                                              .map((p: any) => `${p.product?.name || p.name} x${p.quantity}`)
                                              .join(", "),
                                            35
                                          )}
                                        </td>
                                        <td className="p-4 capitalize">{sale.paymentMethod}</td>
                                        <td className="p-4 text-right font-medium">
                                          {sale.total.toLocaleString("es-AR", {
                                            style: "currency",
                                            currency: "ARS",
                                          })}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {showCloseCashForm && (
            <motion.div
              onClick={() => setShowCloseCashForm(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
              >
                <CloseCashForm
                  cashId={selectedCash._id}
                  onBack={() => setShowCloseCashForm(false)}
                  onClosed={() => setShowCloseCashForm(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
