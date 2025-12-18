"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import { useAuth } from "../../../../context/authContext";
import { getProfile, updateProfile, changeMyPassword } from "../../../../utils/api";
import { Lock, Save, User, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const toast = useToast();
  const { setUser: setGlobalUser, user: globalUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // State for password visibility
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // FORM: datos personales
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    role: "",
    address: "",
  });

  // FORM: cambio contraseña
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // ================================
  // Cargar perfil al iniciar
  // ================================
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setUser(data);
        setForm({
          name: data.name,
          businessName: data.businessName || "",
          email: data.email,
          role: data.role ?? "",
          address: data.address || "",
        });
      } catch {
        toast.error("Error al cargar perfil ❌");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Cargando perfil…</p>;

  const isAdmin = user.role === "admin";

  // ================================
  // Guardar datos personales
  // ================================
  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const res = await updateProfile(form);
      
      // Actualizar estado global
      if (res.user) {
        setGlobalUser((prev: any) => {
          if (!prev) return null;
          const updated = { ...prev, ...res.user };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }

      toast.success("Perfil actualizado ✔");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo actualizar ❌");
    }
  };

  // ================================
  // Cambiar contraseña
  // ================================
  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    try {
      await changeMyPassword(passwordForm);
      toast.success("Contraseña actualizada ✔");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cambiar la contraseña ❌");
    }
  };

  return (
    <section className="p-6 space-y-8">

      {/* ======================================
          ENCABEZADO
      ====================================== */}
      <div>
        <h1 className="text-2xl font-semibold text-primary">Mi perfil</h1>
        <p className="text-gray-400">Gestiona tu información personal</p>
      </div>

      {/* ======================================
          FORMULARIO INFO PERSONAL
      ====================================== */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1f1f1f] rounded-md p-6 space-y-5"
      >
        <h2 className="text-lg font-semibold text-primary-300 flex items-center gap-2">
          <User size={20} /> Información personal
        </h2>

        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] p-2 rounded text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
          />
        </div>

        {/* Nombre del Negocio */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Nombre del Negocio</label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            className="bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] p-2 rounded text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
          />
        </div>

        {/* Dirección */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Dirección</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] p-2 rounded text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Ej: Av. Rivadavia 1234, CABA"
          />
        </div>

        {/* Email SOLO ADMIN */}
        {isAdmin && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Correo</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] p-2 rounded text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>
        )}

        {/* Rol SOLO ADMIN */}
        {/* {isAdmin && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Rol</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="bg-[#121212] border border-[#1f1f1f] p-2 rounded text-gray-200"
            >
              <option value="admin">Admin</option>
              <option value="empleado">Empleado</option>
            </select>
          </div>
        )} */}

        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-700 px-5 py-2 rounded-md text-white flex items-center gap-2"
        >
          <Save size={18} /> Guardar cambios
        </button>
      </form>

      {/* ======================================
          CAMBIAR CONTRASEÑA
      ====================================== */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1f1f1f] rounded-md p-6 space-y-5"
      >
        <h2 className="text-lg font-semibold text-primary-300 flex items-center gap-2">
          <Lock size={20} /> Cambiar contraseña
        </h2>

        {/* Contraseña actual */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Contraseña actual</label>
          <div className="relative">
            <input
              type={showOldPass ? "text" : "password"}
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              className="w-full bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] p-2 rounded text-gray-900 dark:text-gray-200 pr-10 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Nueva contraseña */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showNewPass ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full bg-gray-200 dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] p-2 rounded text-gray-900 dark:text-gray-200 pr-10 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BOTÓN CAMBIAR */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md text-white flex items-center gap-2"
        >
          <Lock size={18} /> Actualizar contraseña
        </button>
      </form>

    </section>
  );
}
