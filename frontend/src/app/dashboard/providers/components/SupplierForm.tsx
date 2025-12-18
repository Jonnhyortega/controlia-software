import { motion } from "framer-motion";
import { Button } from "../../components/button";
import { FormattedPriceInput } from "../../../../components/FormattedPriceInput";
import { Building2, Mail, MapPin, Phone, DollarSign, X } from "lucide-react";

interface SupplierFormProps {
  form: any;
  handleChange: (e: any) => void;
  handleSubmit: (e: any) => void;
  editingId: string | null;
  isSubmitting?: boolean;
  onClose?: () => void;
}

export function SupplierForm({
  form,
  handleChange,
  handleSubmit,
  editingId,
  isSubmitting = false,
  onClose,
}: SupplierFormProps) {
  return (
    <div className="dark:bg-[#18181b] bg-white rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 max-w-2xl mx-auto relative overflow-hidden transition-all">
      
      {/* Header */}
      <div className="flex items-center gap-5 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-6 relative">
        <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300">
          <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {editingId ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {editingId ? "Actualiza los datos de la empresa seleccionada" : "Registra un nuevo proveedor o distribuidor"}
          </p>
        </div>
        {onClose && (
            <button 
                onClick={onClose} 
                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 dark:hover:text-red-500 transition-colors p-2 hover:text-red  rounded-full"
            >
                <X size={20} />
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Nombre de la Empresa <span className="text-red-500">*</span></label>
            <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ej: Distribuidora S.A."
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Teléfono</label>
             <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Ej: 11 1234 5678"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
             </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Correo Electrónico</label>
             <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contacto@empresa.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
             </div>
          </div>

          {/* Dirección */}
          <div className="col-span-2 space-y-1.5">
             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Dirección / Ubicación</label>
             <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Ej: Av. Corrientes 1234"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                />
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800/50 flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto bg-primary hover:bg-primary-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-95 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : (editingId ? "Guardar Cambios" : "Registrar Proveedor")}
            </Button>
        </div>

      </form>
    </div>
  );
}
