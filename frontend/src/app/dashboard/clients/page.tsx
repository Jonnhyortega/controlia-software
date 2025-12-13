"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MapPin, Phone, Mail, User, Trash2, Edit2, ExternalLink } from "lucide-react";
import { getClients, createClient, updateClient, deleteClient } from "../../../utils/api";
import { Client } from "../../../types/api";
import { AnimatePresence, motion } from "framer-motion";
import ClientForm from "./components/ClientForm";
import { useToast } from "../../../context/ToastContext";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <User className="text-primary" /> Clientes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Administra tu base de datos de clientes</p>
        </div>
        <button
          onClick={() => { setEditingClient(undefined); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800 pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition dark:text-white"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando clientes...</div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
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
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 font-bold flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{client.name}</h3>
                      {client.dni && <span className="text-xs text-gray-400 font-mono">ID: {client.dni}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                        onClick={() => { setEditingClient(client); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(client._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
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
                        <div className="flex items-center gap-3">
                            <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                                <Mail size={13} />
                            </div>
                            <span className="truncate">{client.email}</span>
                        </div>
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

    </div>
  );
}