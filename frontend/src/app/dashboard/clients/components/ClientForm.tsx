"use client";

import { useState } from "react";
import { X, User, Phone, Mail, MapPin, FileText, AlignLeft } from "lucide-react";
import { Client } from "../../../../types/api";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Partial<Client>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ClientForm({ initialData, onSubmit, onCancel, isSubmitting = false }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    dni: initialData?.dni || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-md shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-200/50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {initialData ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nombre */}
          <div className="relative">
            <User className="absolute right-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Nombre Completo *"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-200 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* DNI */}
          <div className="relative">
            <FileText className="absolute right-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="dni"
              placeholder="DNI / CUIT (Opcional)"
              value={formData.dni}
              onChange={handleChange}
              className="w-full bg-gray-200 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <Phone className="absolute right-4 top-3.5 text-gray-400" size={18} />
                <input
                type="text"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-200 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
            </div>
             <div className="relative">
                <Mail className="absolute right-4 top-3.5 text-gray-400" size={18} />
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-200 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
            </div>
          </div>

          {/* Dirección */}
          <div className="relative">
            <MapPin className="absolute right-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-gray-200 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Notas */}
          <div className="relative">
            <AlignLeft className="absolute right-4 top-3.5 text-gray-400" size={18} />
            <textarea
              name="notes"
              placeholder="Notas adicionales..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-200 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
            />
          </div>
          

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 order-2 bg-primary hover:bg-primary-600 text-white font-bold rounded-md transition shadow-lg shadow-primary/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Guardando..." : (initialData ? "Actualizar" : "Crear Cliente")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
