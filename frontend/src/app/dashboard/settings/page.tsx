"use client";

import { useRouter } from "next/navigation";
import { UserCog, Users, ShieldCheck, Palette, Building2, CreditCard } from "lucide-react";
import { useAuth } from "../../../context/authContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin";

  const allCards = [
    {
      icon: <Users size={28} className="text-primary" />,
      title: "Gestión de empleados",
      desc: "Crear, editar o desactivar usuarios con rol empleado.",
      action: () => router.push("/dashboard/settings/employees"),
      adminOnly: true,
    },
    {
      icon: <UserCog size={28} className="text-primary" />,
      title: "Mi perfil",
      desc: "Actualizar nombre, email, contraseña y preferencias personales.",
      action: () => router.push("/dashboard/settings/profile"),
      adminOnly: false,
    },
    {
      icon: <Palette size={28} className="text-primary" />,
      title: "Personalización",
      desc: "Logo, colores de la marca y apariencia del sistema.",
      action: () => router.push("/dashboard/settings/customization"),
      adminOnly: true,
    },
    {
      icon: <CreditCard size={28} className="text-primary" />,
      title: "Suscripción y Pagos",
      desc: "Gestionar plan, método de pago y facturación.",
      action: () => router.push("/dashboard/subscription"),
      adminOnly: true,
    },
  ];

  const cards = allCards.filter(c => !c.adminOnly || isAdmin);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">
        Configuración del sistema
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Administrá tu cuenta, tus empleados y las preferencias de Controlia.
      </p>

      {/* Grid de tarjetas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.action}
            className="group bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1f1f1f] p-6 rounded-2xl 
                      shadow-md hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] hover:border-primary/40 
                       transition-all text-left"
          >
            <div className="mb-3">{card.icon}</div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition">
              {card.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {card.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
