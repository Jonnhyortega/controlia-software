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
    <div className="fixed h-full w-full -top-5 inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="overflow-y-scroll bg-white w-[90%] h-[90%] dark:bg-background rounded-md
       shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center gap-5 p-6 sm:p-8 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
           <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-md shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300">
             <User className="w-7 h-7 text-white" strokeWidth={1.5} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
               {initialData ? "Editar Cliente" : "Nuevo Cliente"}
             </h2>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
               {initialData ? "Actualizar información existente" : "Ingresa los datos para el alta"}
             </p>
           </div>
           
           <button 
              onClick={onCancel} 
              className="absolute top-4 right-4 text-gray-400 transition-colors p-2 hover:text-red-500 rounded-full"
            >
             <X size={20} />
           </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 ">
          
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Nombre Completo <span className="text-red-500">*</span></label>
            <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                type="text"
                name="name"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>
          </div>

          {/* DNI */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">DNI / CUIT</label>
            <div className="relative group">
                <FileText className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                    type="text"
                    name="dni"
                    placeholder="Número de documento"
                    value={formData.dni}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Teléfono</label>
                <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                    <input
                    type="text"
                    name="phone"
                    placeholder="Ej: 11 1234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>
             <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email</label>
                <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                    <input
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Dirección</label>
            <div className="relative group">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                type="text"
                name="address"
                placeholder="Calle, Número, Localidad"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Notas</label>
            <div className="relative group">
                <AlignLeft className="absolute right-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <textarea
                name="notes"
                placeholder="Información adicional sobre el cliente..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                />
            </div>
          </div>
          

          {/* Actions */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-md text-base font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] ${
                  isSubmitting ? 'bg-gray-300 dark:bg-zinc-700 cursor-not-allowed text-gray-500' : 'bg-primary hover:bg-primary-700 text-white'
              }`}
            >
              {isSubmitting ? "Guardando..." : (initialData ? "Actualizar Cliente" : "Crear Cliente")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
