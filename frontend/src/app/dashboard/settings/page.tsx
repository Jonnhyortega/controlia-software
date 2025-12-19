"use client";

import { useRouter } from "next/navigation";
import { UserCog, Users, ShieldCheck, Palette, Building2, CreditCard, Settings } from "lucide-react";
import { useAuth } from "../../../context/authContext";
import { CollapsibleSection } from "../../../components/ui/CollapsibleSection";

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
    <section className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      
      {/* 🔹 HEADER: Título Cool */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-md shadow-lg shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
           <Settings className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
             Configuración
          </h1>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
             Administrá tu cuenta y preferencias
          </span>
        </div>
      </div>

      <CollapsibleSection title="Panel de Configuración" icon={UserCog} defaultOpen={true}>
        {/* Grid de tarjetas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {cards.map((card, i) => (
            <button
                key={i}
                onClick={card.action}
                className="group bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#1f1f1f] p-6 rounded-md 
                        shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 
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
      </CollapsibleSection>
    </section>
  );
}
