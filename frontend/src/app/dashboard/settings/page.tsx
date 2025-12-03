"use client";

import { useRouter } from "next/navigation";
import { UserCog, Users, ShieldCheck, Palette, Building2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const cards = [
    {
    icon: <Users size={28} className="text-primary" />,
      title: "Gestión de empleados",
      desc: "Crear, editar o desactivar usuarios con rol empleado.",
      action: () => router.push("/dashboard/settings/employees"),
    },
    {
      icon: <UserCog size={28} className="text-primary" />,
      title: "Mi perfil",
      desc: "Actualizar nombre, email, contraseña y preferencias personales.",
      action: () => router.push("/dashboard/settings/profile"),
    },
    {
      icon: <Palette size={28} className="text-primary" />,
      title: "Personalización",
      desc: "Logo, colores de la marca y apariencia del sistema.",
      action: () => router.push("/dashboard/settings/customization"),
    },
    {
      icon: <ShieldCheck size={28} className="text-primary" />,
      title: "Seguridad",
      desc: "Ver actividad reciente, cerrar sesiones y reiniciar contraseña.",
      action: () => router.push("/dashboard/settings/security"),
    },
    {
      icon: <Building2 size={28} className="text-primary" />,
      title: "Preferencias generales",
      desc: "Horarios, moneda, formatos de ticket y opciones del sistema.",
      action: () => router.push("/dashboard/settings/general"),
    },
  ];

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">
        Configuración del sistema
      </h1>

      <p className="text-gray-400 mb-10">
        Administrá tu cuenta, tus empleados y las preferencias de Controlia.
      </p>

      {/* Grid de tarjetas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.action}
            className="group bg-[#0f0f0f] border border-[#1f1f1f] p-6 rounded-2xl 
                      shadow-md hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] hover:border-primary/40 
                       transition-all text-left"
          >
            <div className="mb-3">{card.icon}</div>

            <h3 className="text-lg font-semibold text-gray-200 group-hover:text-primary-300 transition">
              {card.title}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              {card.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
