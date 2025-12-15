"use client";

import MarketingLayout from "../landing/components/MarketingLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Book, Package, ShoppingCart, Users, Settings, DollarSign, BarChart3, Menu } from "lucide-react";

const sections = [
  {
    id: "intro",
    title: "Introducción",
    icon: Book,
    content: (
      <div className="space-y-4">
        <p>
          Bienvenido a la documentación oficial de <strong>Controlia</strong>. Esta guía te ayudará a configurar y aprovechar al máximo tu nuevo sistema de gestión empresarial.
        </p>
        <p>
          Controlia está diseñado para ser intuitivo y eficiente, permitiéndote controlar tu inventario, ventas y proveedores desde una única plataforma moderna.
        </p>
      </div>
    )
  },
  {
    id: "products",
    title: "Gestión de Productos",
    icon: Package,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Crear un Producto</h3>
        <p>
          Para agregar un nuevo producto a tu inventario:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300">
          <li>Navega a la sección <strong>Productos</strong> en el menú lateral.</li>
          <li>Haz clic en el botón <strong>"Nuevo Producto"</strong>.</li>
          <li>Completa los campos obligatorios: Nombre, Precio de Costo, Precio de Venta y Stock inicial.</li>
          <li>Opcionalmente, puedes escanear un <strong>código de barras</strong> para asignarlo automáticamente.</li>
          <li>Guarda los cambios.</li>
        </ol>

        <h3 className="text-xl font-semibold text-white mt-8">Historial de Cambios</h3>
        <p>
          Controlia guarda un registro detallado de cada modificación. Puedes ver quién cambió el precio o el stock de un producto haciendo clic en el icono de historial en la lista de productos.
        </p>
      </div>
    )
  },
  {
    id: "sales",
    title: "Punto de Venta (POS)",
    icon: ShoppingCart,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Realizar una Venta</h3>
        <p>
          El módulo de ventas está optimizado para la velocidad:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Usa el <strong>escáner de código de barras</strong> para agregar productos al carrito instantáneamente.</li>
          <li>O busca manualmente por nombre escribiendo en la barra de búsqueda.</li>
          <li>Ajusta las cantidades directamente en la tabla de venta.</li>
          <li>Selecciona el <strong>Método de Pago</strong> (Efectivo, Tarjeta, Transferencia, etc.).</li>
          <li>Haz clic en <strong>Finalizar Venta</strong> para registrar la transacción y descontar el stock.</li>
        </ul>
      </div>
    )
  },
  {
    id: "finance",
    title: "Caja y Finanzas",
    icon: DollarSign,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Cierre de Caja</h3>
        <p>
          Al finalizar el día, es importante realizar el cierre de caja para cuadrar tus ingresos:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300">
          <li>Ve al <strong>Dashboard</strong> principal.</li>
          <li>Verás un resumen de las ventas del día desglosado por método de pago.</li>
          <li>Ingresa los gastos del día si hubo (ej. pago a proveedores, insumos).</li>
          <li>El sistema calculará automáticamente el total esperado en caja.</li>
        </ol>
      </div>
    )
  },
  {
    id: "providers",
    title: "Proveedores y Clientes",
    icon: Users,
    content: (
      <div className="space-y-6">
        <p>
          Mantén organizada tu agenda de contactos comerciales.
        </p>
        <h3 className="text-xl font-semibold text-white">Proveedores</h3>
        <p>
          Registra a tus proveedores para llevar un control de a quién le compras qué productos. Esto facilita la reposición de stock futura.
        </p>
        <h3 className="text-xl font-semibold text-white mt-4">Clientes y Fiados</h3>
        <p>
          Puedes registrar clientes habituales y asignarles ventas a crédito (Cuenta Corriente). El sistema llevará la cuenta de cuánto deben y te permitirá registrar pagos parciales.
        </p>
      </div>
    )
  },
  {
    id: "settings",
    title: "Configuración",
    icon: Settings,
    content: (
      <div className="space-y-6">
        <p>
          Personaliza Controlia a tu gusto:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li><strong>Perfil:</strong> Actualiza tu logo y nombre comercial para que aparezcan en los tickets.</li>
          <li><strong>Tema:</strong> Alterna entre Modo Oscuro y Modo Claro según tu preferencia.</li>
          <li><strong>Usuarios:</strong> (Plan Pro) Crea cuentas para tus empleados con permisos limitados.</li>
        </ul>
      </div>
    )
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MarketingLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4 border-b border-gray-800 bg-[#0f0f12]">
             <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 text-white"
             >
                <Menu /> 
                <span className="font-semibold">Menú de Documentación</span>
             </button>
        </div>

        {/* Sidebar Navigation */}
        <aside className={`
            fixed md:sticky top-0 left-0 z-40 w-full md:w-64 h-full md:h-[calc(100vh-64px)] 
            bg-[#0f0f12] border-r border-gray-800 overflow-y-auto transition-transform duration-300
            ${mobileMenuOpen ? "translate-y-16" : "-translate-y-full md:translate-y-0"}
            md:top-16
        `}>
          <nav className="p-6 space-y-2">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">
              Documentación
            </h2>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-[#1a1b1e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            {sections.map((section) => (
              section.id === activeSection && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-primary-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">{section.title}</h1>
                  </div>
                  
                  <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                    {section.content}
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </div>

      </div>
    </MarketingLayout>
  );
}
