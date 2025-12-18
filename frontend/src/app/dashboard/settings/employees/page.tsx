"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  MoreVertical,
  Edit3,
  Trash2,
  RefreshCcw,
  UserX,
  ShieldCheck,
  Lock,
  Check,
} from "lucide-react";

import { useToast } from "../../../../context/ToastContext";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  disableEmployee,
  enableEmployee,
  deleteEmployee,
  resetEmployeePassword,
} from "../../../../utils/api";

import { ConfirmDialog } from "../../../dashboard/components/confirmDialog";
import RoleGuard from "@/components/auth/RoleGuard";

export default function EmployeesPage() {
  const toast = useToast();

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal principal (crear/editar)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "empleado",
  });

  // Modal reset password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPass, setNewPass] = useState("");

  // Confirm dialog
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const askConfirmation = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  // Load employees
  useEffect(() => {
    (async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        toast.error("Error al cargar empleados ❌");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Open modal for creating
  const openCreateModal = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "", role: "empleado" });
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = (emp: any) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      password: "",
      role: emp.role,
    });
    setShowModal(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save employee
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        const updated = await updateEmployee(editingId, form);
        setEmployees((prev) =>
          prev.map((u) => (u._id === editingId ? updated : u))
        );
        toast.success("Empleado actualizado ✔");
      } else {
        const created = await createEmployee(form);
        setEmployees((prev) => [...prev, created]);
        toast.success("Empleado creado correctamente ✔");
      }
      setShowModal(false);
    } catch {
      toast.error("Error al guardar ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable
  const handleDisable = async (id: string) => {
    try {
      await disableEmployee(id);
      setEmployees((prev) =>
        prev.map((u) => (u._id === id ? { ...u, disabled: true } : u))
      );
      toast.success("Empleado desactivado ✔");
    } catch {
      toast.error("No se pudo desactivar ❌");
    }
  };

  // Enable
  const handleEnable = async (id: string) => {
    try {
      await enableEmployee(id);
      setEmployees((prev) =>
        prev.map((u) => (u._id === id ? { ...u, disabled: false } : u))
      );
      toast.success("Empleado activado ✔");
    } catch {
      toast.error("No se pudo activar ❌");
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((u) => u._id !== id));
      toast.success("Empleado eliminado ✔");
    } catch {
      toast.error("Error al eliminar ❌");
    }
  };

  // Reset password
  const handlePasswordReset = async () => {
    try {
      await resetEmployeePassword(editingId!, newPass);
      toast.success("Contraseña actualizada ✔");
      setShowPasswordModal(false);
    } catch {
      toast.error("No se pudo actualizar contraseña ❌");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Cargando empleados…</p>;

  return (
    <RoleGuard role="admin">
      <section className="p-6 space-y-6">
        {/* HEADER */}
        {/* ... (keep existing content intact, just wrapped) ... */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary">Gestión de empleados</h1>
          <button
            onClick={openCreateModal}
            className="bg-primary hover:bg-primary-700 px-4 py-2 rounded-md text-white flex items-center gap-2"
          >
            <UserPlus size={18} /> Nuevo empleado
          </button>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.name}
            className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1f1f1f] rounded-md p-5 relative shadow-xl hover:shadow-2xl transition"
          >
            {/* Badge de estado */}
            <span
              className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full ${
                emp.disabled
                  ? "bg-red-700 text-white"
                  : "bg-green-700 text-white"
              }`}
            >
              {emp.disabled ? "Desactivado" : "Activo"}
            </span>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{emp.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{emp.email}</p>
            <p className="text-primary-300 text-xs mt-1 capitalize">
              {emp.role === "admin" && <ShieldCheck className="inline w-3 mr-1" />}
              {emp.role}
            </p>

            {/* MENU DE ACCIONES */}
            <div className="mt-4 flex flex-col gap-2">

              <button
                onClick={() => openEditModal(emp)}
                className="flex items-center gap-2 text-primary-300 hover:text-primary-200"
              >
                <Edit3 size={16} /> Editar
              </button>

              {!emp.disabled ? (
                <button
                  onClick={() =>
                    askConfirmation(`¿Desactivar a ${emp.name}?`, () =>
                      handleDisable(emp._id)
                    )
                  }
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                >
                  <UserX size={16} /> Desactivar
                </button>
              ) : (
                <button
                  onClick={() =>
                    askConfirmation(`¿Activar a ${emp.name}?`, () =>
                      handleEnable(emp._id)
                    )
                  }
                  className="flex items-center gap-2 text-green-400 hover:text-green-300"
                >
                  <Check size={16} /> Activar
                </button>
              )}

              <button
                onClick={() => {
                  setEditingId(emp._id);
                  setShowPasswordModal(true);
                }}
                className="flex items-center gap-2 text-green-400 hover:text-green-300"
              >
                <Lock size={16} /> Cambiar contraseña
              </button>

              <button
                onClick={() =>
                  askConfirmation(
                    `⚠ ¿Eliminar definitivamente a ${emp.name}?`,
                    () => handleDelete(emp._id)
                  )
                }
                className="flex items-center gap-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={showConfirm}
        message={confirmMessage}
        onConfirm={() => {
          confirmAction?.();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1f1f1f] rounded-md p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-semibold text-primary-300">
              {editingId ? "Editar empleado" : "Nuevo empleado"}
            </h3>

            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 rounded bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50"
              required
            />

            <input
              type="email"
              placeholder="Correo"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 rounded bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50"
              required
            />

            {!editingId && (
              <input
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-2 rounded bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            )}

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-2 rounded bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md text-gray-400 hover:text-gray-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-700 px-4 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-md p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-primary-300">
              Cambiar contraseña
            </h3>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full p-2 rounded bg-[#121212] border border-[#1f1f1f] text-gray-200"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-md text-gray-400 hover:text-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={handlePasswordReset}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      </section>
    </RoleGuard>
  );
}
