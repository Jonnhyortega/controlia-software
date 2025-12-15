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
    <div className="dark:bg-background bg-white rounded-2xl shadow-xl border border-gray-100 dark:border-border p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100 dark:border-border">
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <Building2 size={32} />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingId ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                {editingId ? "Actualiza los datos del proveedor seleccionado." : "Registra un nuevo proveedor en el sistema."}
            </p>
            </div>
        </div>
        {onClose && (
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <X size={24} />
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre de la Empresa / Proveedor</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ej: Distribuidora S.A."
                    required
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
            </div>
          </div>

          {/* Teléfono */}
          <div>
             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Ej: 11 1234 5678"
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
             </div>
          </div>

          {/* Email */}
          <div>
             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
             <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contacto@empresa.com"
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    style={{ paddingLeft: '18%' }}
                />
             </div>
          </div>

          {/* Dirección */}
          <div className="col-span-2">
             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dirección / Ubicación</label>
             <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Ej: Av. Corrientes 1234"
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
             </div>
          </div>

          {/* Deuda */}
          <div className="col-span-2 md:col-span-1">
             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Saldo / Deuda Inicial</label>
             <FormattedPriceInput
                name="debt"
                value={form.debt}
                onChange={handleChange}
                placeholder="0"
                disabled={false}
             />
             <p className="text-xs text-gray-400 mt-1">Saldo pendiente de pago a este proveedor.</p>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-border flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto bg-primary hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all transform active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : (editingId ? "Guardar Cambios" : "Registrar Proveedor")}
            </Button>
        </div>

      </form>
    </div>
  );
}
