"use client";

import { useEffect, useState } from "react";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Trash2,
  Phone,
  MapPin,
  Search
} from "lucide-react";
import { Button } from "../components/button";
import { ConfirmDialog } from "../components/confirmDialog";
import Loading from "../../../components/loading";
import { useToast } from "../../../context/ToastContext";
import Overlay from "../components/overlay";
import { SupplierForm } from "./components/SupplierForm";
import PaymentHistorySection from "../components/Transactions/PaymentHistorySection";


export default function SuppliersPage() {
  const toast = useToast();


  // 📦 Estados principales
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔐 ConfirmDialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // 🧾 Formulario
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    debt: 0,
  });

  // 🔹 Cargar proveedores
    const fetchData = async () => {
      try {
        const res = await getSuppliers();
        setSuppliers(res);
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
        toast.error("Error al obtener proveedores ❌");
      } finally {
        setLoading(false);
      }
    };

  // 🔹 Cargar proveedores al montar
  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Manejo de inputs
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Guardar proveedor
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateSupplier(editingId, form);
        setSuppliers((prev) =>
          prev.map((s) => (s._id === editingId ? updated : s))
        );
        toast.success("Proveedor actualizado correctamente ✅");
      } else {
        const created = await createSupplier(form);
        setSuppliers((prev) => [created, ...prev]);
        toast.success("Proveedor agregado correctamente ✅");
      }

      setEditingId(null);
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        debt: 0,
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      toast.error("Error al guardar proveedor ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✏️ Editar proveedor
  const handleEdit = (supplier: any) => {
    setEditingId(supplier._id);
    setForm({
      name: supplier.name,
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      debt: supplier.debt || 0,
    });
    setShowForm(true);
  };

  // 🗑️ Eliminar proveedor
  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: "¿Eliminar proveedor?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          await deleteSupplier(id);
          setSuppliers((prev) => prev.filter((s) => s._id !== id));
          toast.success("Proveedor eliminado correctamente ✅");
        } catch (err) {
          console.error("Error al eliminar proveedor:", err);
          toast.error("Error al eliminar proveedor ❌");
        } finally {
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  // 🔎 Filtrado
  const filteredSuppliers = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loading />;

  return (
    <section className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 🔹 HEADER: Título y Acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 dark:bg-background bg-white p-4 rounded-md shadow-sm border border-gray-100">
         
         <div className="flex items-center gap-3 w-full md:w-auto ">
            <div className="bg-primary/10 p-3 rounded-md text-primary">
               <Building2 className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-gray-900 dark:text-white">Proveedores</h1>
               <p className="text-sm text-gray-500 hidden md:block">Gestión de empresas y distribuidores</p>
            </div>
         </div>

         <div className="flex gap-3 w-full md:w-auto">
             {/* Buscador */}
             <div className="relative flex-1 md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-gray-200 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
             </div>

             {/* Botón Nuevo */}
             <Button
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    debt: 0,
                  });
                  setShowForm(true);
                }}
                className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-md shadow-md transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={20} />
                <span className="hidden md:inline">Nuevo</span>
              </Button>
         </div>
      </div>


      {/* 📋 Lista */}
      <div className="p-6 rounded-md shadow-md border border-gray-100 min-h-[50vh] dark:bg-background bg-white">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-400 mb-6 flex items-center gap-2">
           Listado ({filteredSuppliers.length})
        </h2>

        {filteredSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-md dark:bg-background bg-white">
             <Building2 size={48} className="opacity-20 mb-3" />
            <p>No se encontraron proveedores</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
            {filteredSuppliers.map((s, i) => {
              const isOpen = expanded === i;

              return (
                <motion.div
                  key={s._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group dark:bg-background bg-white border border-gray-100 rounded-md overflow-hidden transition-all duration-300 ${
                    isOpen ? "shadow-xl ring-1 ring-primary/10 z-10" : "shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* 🔹 Encabezado proveedor */}
                  <div
                    className="flex justify-between items-center p-5 cursor-pointer select-none"
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-5">
                       {/* Enhanced Avatar */}
                       <div className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-xl shadow-sm transition-colors ${isOpen ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}>
                          {s.name?.charAt(0).toUpperCase()}
                       </div>
                       
                       <div className="space-y-1">
                         <h3 className={`font-bold text-lg leading-tight transition-colors ${isOpen ? "text-primary" : "text-gray-800 dark:text-gray-100"}`}>
                            {s.name || "Sin nombre"}
                         </h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {s.email || "Sin email registrado"}
                         </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-10">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">{s.debt > 0 ?"Deuda Total" : "A favor"}</span>
                        <span
                          className={`font-mono text-base font-bold ${
                            s.debt > 0 ? "text-rose-500" : "text-emerald-600"
                          }`}
                        >
                          ${new Intl.NumberFormat("es-AR").format(s.debt || 0)}
                        </span>
                      </div>
                      <div className={`transition-transform duration-300 p-2 rounded-full ${isOpen ? "rotate-180 bg-primary/10 text-primary" : "text-gray-400 group-hover:bg-gray-600"}`}>
                         <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* 🔹 Detalle */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-200/50 dark:bg-muted/10 border-t border-gray-100 dark:border-gray-800"
                      >
                         <div className="p-5 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            {/* Items cleanly listed without boxes */}
                            {/* Phone -> WhatsApp */}
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-primary shadow-sm shrink-0">
                                   <Phone size={18} />
                                </div>
                                <div>
                                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Teléfono</p>
                                   {s.phone ? (
                                     <a 
                                       href={`https://wa.me/${s.phone.replace(/[^0-9]/g, "")}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="font-medium text-base text-gray-800 dark:text-gray-200 hover:text-green-600 hover:underline transition-colors flex items-center gap-1"
                                     >
                                       {s.phone}
                                     </a>
                                   ) : (
                                     <p className="font-medium text-base text-gray-400">—</p>
                                   )}
                                </div>
                            </div>

                            {/* Address -> Google Maps */}
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-primary shadow-sm shrink-0">
                                   <MapPin size={18} />
                                </div>
                                <div>
                                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dirección</p>
                                   {s.address ? (
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-base text-gray-800 dark:text-gray-200 hover:text-blue-600 hover:underline transition-colors"
                                      >
                                        {s.address}
                                      </a>
                                   ) : (
                                      <p className="font-medium text-base text-gray-400">—</p>
                                   )}
                                </div>
                            </div>
                            
                             {/* Mobile Debt */}
                            <div className="md:hidden flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 shadow-sm shrink-0">
                                   <span className="font-bold text-lg">$</span>
                                </div>
                                <div>
                                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deuda Actual</p>
                                    <p
                                      className={`font-mono text-base font-bold ${
                                        s.debt > 0 ? "text-rose-500" : "text-emerald-600"
                                      }`}
                                    >
                                      ${new Intl.NumberFormat("es-AR").format(s.debt || 0)}
                                    </p>
                                </div>
                            </div>

                             {/* Payment History */}
                             <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <PaymentHistorySection context="SUPPLIER" entityId={s._id} refreshParent={fetchData} />
                             </div>
                          </div>
                          
                         <div className="px-5 pb-6 md:px-20 pt-2 flex justify-end gap-3">
                             <Button
                            onClick={() => handleEdit(s)}
                            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center gap-2 py-2.5 px-6 rounded-md shadow-sm font-semibold transition-all active:scale-95"
                          >
                            <Edit3 className="w-4 h-4" /> Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(s._id)}
                            className="bg-white dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 border border-gray-200 dark:border-gray-700 hover:border-rose-200 flex items-center gap-2 py-2.5 px-6 rounded-md shadow-sm font-semibold transition-all active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar
                          </Button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO */}
      {showForm && (
        <Overlay fullScreen={true}>
          <div className="relative w-full max-w-4xl mx-auto my-10">
            <SupplierForm 
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                editingId={editingId}
                isSubmitting={isSubmitting}
                onClose={() => setShowForm(false)}
            />
          </div>
        </Overlay>
      )}

      {/* 🔹 ConfirmDialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </section>
  );
}
