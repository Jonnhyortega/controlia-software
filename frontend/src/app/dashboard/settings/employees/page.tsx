"use client";

import { useEffect, useState } from "react";
import { 
  getEmployees, 
  createEmployee, 
  deleteEmployee, 
  updateEmployee 
} from "../../../../utils/api";
import { Employee } from "../../../../types/api";
import { Plus, Trash2, Edit2, Shield, User, Mail, Ban, CheckCircle } from "lucide-react";
import { useAuth } from "../../../../context/authContext";
import { useToast } from "../../../../context/ToastContext";
import Loading from "../../../../components/loading";
import Overlay from "../../components/overlay";
import { motion, AnimatePresence } from "framer-motion";
import { CollapsibleSection } from "../../../../components/ui/CollapsibleSection";

export default function EmployeesPage() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", 
    role: "empleado" as "admin" | "empleado",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchEmployees();
  }, [user]);

  // Handle Save (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        // Update logic (Backend needs updateEmployee endpoint usually not strictly defined for password yet, but assuming exists or we use create for now?)
        // Assuming updateEmployee exists in api.ts
        await updateEmployee(editingId, formData); 
        toast.success("Empleado actualizado");
      } else {
        await createEmployee(formData);
        toast.success("Empleado creado exitosamente");
      }
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Error al guardar empleado");
    } finally {
        setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este empleado?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e._id !== id));
      toast.success("Empleado eliminado");
    } catch (error) {
       toast.error("No se pudo eliminar el empleado");
    }
  };

  const resetForm = () => {
      setFormData({ name: "", email: "", password: "", role: "empleado" });
      setEditingId(null);
  };

  const openEdit = (emp: Employee) => {
      setEditingId(emp._id);
      setFormData({ 
          name: emp.name, 
          email: emp.email, 
          password: "", // Password usually blank on edit
          role: emp.role as "admin" | "empleado"
      });
      setShowModal(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
       
       {/* HEADER */}
       <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/60 rounded-md shadow-lg shadow-primary/25 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
           <Shield className="w-8 h-8 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Empleados y Accesos
          </h1>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Gestiona quien tiene acceso a tu sistema
          </span>
        </div>
      </div>
      
      {/* ACTIONS */}
      <div className="flex justify-end">
          <button 
             onClick={() => { resetForm(); setShowModal(true); }}
             className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-md font-bold shadow-md transition-all active:scale-95"
          >
              <Plus size={20} />
              <span>Nuevo Empleado</span>
          </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {employees.map((emp) => (
               <motion.div 
                  key={emp._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
               >
                   <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${emp.role === 'admin' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'}`}>
                               {emp.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                               <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{emp.name}</h3>
                               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">{emp.role}</p>
                           </div>
                       </div>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openEdit(emp)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"><Edit2 size={16} /></button>
                           <button onClick={() => handleDelete(emp._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={16} /></button>
                       </div>
                   </div>

                   <div className="space-y-2">
                       <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-900/50 p-2 rounded-md">
                           <Mail size={14} className="opacity-50" />
                           <span className="truncate">{emp.email}</span>
                       </div>
                       {/* Status Indicator (Optional if you have Blocked field) */}
                       {/* <div className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-500">
                           <CheckCircle size={12} /> Activo
                       </div> */}
                   </div>
               </motion.div>
            ))}
          </AnimatePresence>
          
          {employees.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-[#18181b] rounded-xl border border-dashed border-gray-200 dark:border-[#27272a]">
                  <User size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No tienes empleados registrados aún.</p>
              </div>
          )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
            <Overlay>
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 20 }}
                   className="bg-white dark:bg-[#18181b] w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-[#27272a]">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {editingId ? "Editar Empleado" : "Nuevo Empleado"}
                        </h2>
                        <p className="text-sm text-gray-500">Completa los datos de acceso</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                            <input 
                                required
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary outline-none"
                                placeholder="usuario@controlia.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {editingId ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                            </label>
                            <input 
                                type="password" 
                                required={!editingId}
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as any})} 
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="empleado">Empleado (Acceso Limitado)</option>
                                <option value="admin">Admin (Acceso Total)</option>
                            </select>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-[#3f3f46] hover:bg-gray-50 dark:hover:bg-[#27272a] text-gray-700 dark:text-gray-300 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </Overlay>
        )}
      </AnimatePresence>
    </div>
  );
}
