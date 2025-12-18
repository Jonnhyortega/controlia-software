"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MapPin, Phone, Mail, User, Trash2, Edit2, ExternalLink, History as HistoryIcon, X, Settings2, Users } from "lucide-react";
import { getClients, createClient, updateClient, deleteClient } from "../../../utils/api";
import { Client } from "../../../types/api";
import { AnimatePresence, motion } from "framer-motion";
import ClientForm from "./components/ClientForm";
import PaymentHistorySection from "../components/Transactions/PaymentHistorySection";
import Overlay from "../components/overlay";
import { useToast } from "../../../context/ToastContext";
import { CollapsibleSection } from "../../../components/ui/CollapsibleSection";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  
  // 🔹 Auto-abrir lista al buscar
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setIsListOpen(true);
    }
  }, [searchTerm]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);

  const toast = useToast();

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSave = async (data: Partial<Client>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingClient) {
        await updateClient(editingClient._id, data);
        toast?.success?.("Cliente actualizado correctamente");
      } else {
        await createClient(data);
        toast?.success?.("Cliente creado correctamente");
      }
      setIsModalOpen(false);
      setEditingClient(undefined);
      loadClients();
    } catch (error) {
      console.error(error);
      toast?.error?.("Error al guardar cliente");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(c => c._id !== id));
      toast?.success?.("Cliente eliminado");
    } catch (error) {
      console.error(error);
      toast?.error?.("No se pudo eliminar el cliente");
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      
      {/* 🔹 HEADER: Título Cool */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/60 rounded-2xl shadow-lg shadow-primary/25 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
           <User className="w-8 h-8 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Clientes con cuenta corriente
          </h1>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Administra tu base de datos de clientes
          </span>
        </div>
      </div>

       {/* Acciones y Búsqueda (Siempre Visible) */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white dark:bg-background p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-background pl-10 pr-4 py-2.5 rounded-md border-transparent dark:border-zinc-700 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm border border-gray-200"
                />
              </div>

               {/* Botón Nuevo */}
              <button
                onClick={() => { setEditingClient(undefined); setIsModalOpen(true); }}
                className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-md font-bold shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition"
              >
                <Plus size={20} />
                <span>Nuevo Cliente</span>
              </button>
          </div>

      {/* Grid */}
      <CollapsibleSection 
        title="Listado de Clientes" 
        icon={Users} 
        open={isListOpen}
        onToggle={setIsListOpen}
      >
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando clientes...</div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-background rounded-md border border-dashed border-gray-200 dark:border-gray-800">
            <User size={48} className="mx-auto mb-3 opacity-20" />
            <p>No se encontraron clientes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredClients.map((client) => (
              <motion.div
                key={client._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white dark:bg-zinc-900 rounded-md border border-gray-100 dark:border-zinc-700/50 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-400 font-bold flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{client.name}</h3>
                      {client.dni && <span className="text-xs text-gray-400 font-mono block">ID: {client.dni}</span>}
                      {/* Visualización de Deuda */}
                      <div className={`mt-1 text-sm font-medium ${client.balance && client.balance > 0 ? "text-red-500" : "text-green-600"}`}>
                        {client.balance && client.balance > 0 
                          ? `Deuda: $${client.balance.toLocaleString('es-AR')}` 
                          : client.balance && client.balance < 0 
                            ? `Saldo a favor: $${Math.abs(client.balance).toLocaleString('es-AR')}`
                            : "Sin deuda"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                         onClick={() => setHistoryClient(client)}
                         className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition"
                         title="Ver Pagos"
                    >
                        <HistoryIcon size={16} />
                    </button>
                    <button 
                        onClick={() => { setEditingClient(client); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(client._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    
                    {/* INFO CONTACTO */}
                    {client.phone ? (
                        <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group/link hover:text-green-600 transition-colors cursor-pointer">
                            <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 group-hover/link:bg-green-100 dark:group-hover/link:bg-green-900/30 transition-colors">
                                <Phone size={13} />
                            </div>
                            <span className="truncate">{client.phone}</span>
                            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-50" />
                        </a>
                    ) : (
                        <div className="flex items-center gap-3 opacity-50">
                             <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><Phone size={13} /></div>
                             <span>—</span>
                        </div>
                    )}

                    {client.address ? (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group/link hover:text-blue-500 transition-colors cursor-pointer">
                            <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 group-hover/link:bg-blue-100 dark:group-hover/link:bg-blue-900/30 transition-colors">
                                <MapPin size={13} />
                            </div>
                            <span className="truncate">{client.address}</span>
                            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-50" />
                        </a>
                    ) : (
                        <div className="flex items-center gap-3 opacity-50">
                             <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><MapPin size={13} /></div>
                             <span>—</span>
                        </div>
                    )}
                    
                     {client.email ? (
                        <a href={`mailto:${client.email}`} className="flex items-center gap-3 group/link hover:text-primary transition-colors cursor-pointer">
                            <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 group-hover/link:bg-primary/10 dark:group-hover/link:bg-primary/20 transition-colors group-hover/link:text-primary">
                                <Mail size={13} />
                            </div>
                            <span className="truncate">{client.email}</span>
                            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-50" />
                        </a>
                    ) : (
                        <div className="flex items-center gap-3 opacity-50">
                             <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><Mail size={13} /></div>
                             <span>—</span>
                        </div>
                    )}
                </div>
                
                {client.notes && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-500 italic line-clamp-2">"{client.notes}"</p>
                    </div>
                )}
                
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      </CollapsibleSection>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <ClientForm
            initialData={editingClient}
            onSubmit={handleSave}
            onCancel={() => { setIsModalOpen(false); setEditingClient(undefined); }}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* HISTORY MODAL */}
      {historyClient && (
        <Overlay fullScreen>
            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-md w-full max-w-4xl relative shadow-2xl my-10 mx-auto">
                <button
                  onClick={() => setHistoryClient(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                    Historial de Pagos - {historyClient.name}
                </h2>
                <p className="text-sm text-gray-500 mb-6">Registro de cobros y cuentas corrientes</p>

                <PaymentHistorySection context="CLIENT" entityId={historyClient._id} refreshParent={loadClients} />
            </div>
        </Overlay>
      )}

    </div>
  );
}