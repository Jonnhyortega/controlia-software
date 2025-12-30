"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Search, 
  BookOpen, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Mail,
  ArrowLeft,
  FileText,
  CheckCircle2
} from "lucide-react";
import Navbar from "../landing/components/navbar";
import { motion, AnimatePresence } from "framer-motion";

// --- Data & Content ---
const CATEGORIES_CONTENT: Record<string, {
  title: string;
  description: string;
  articles: { title: string; content: string }[];
}> = {
  "primeros-pasos": {
    title: "Primeros Pasos",
    description: "Todo lo que necesitas para comenzar a operar con Controlia.",
    articles: [
      {
        title: "1. Configuración de tu Negocio",
        content: "Lo primero es ir a tu perfil y asegurarte de que el nombre del negocio y la configuración de moneda sean correctos. Esto se reflejará en todos tus comprobantes y reportes."
      },
      {
        title: "2. Creación de Usuarios",
        content: "Si tienes empleados, puedes crear usuarios adicionales con roles limitados (solo ventas) para mantener segura la información sensible de tu administración."
      },
      {
        title: "3. Tu Primer Vistazo al Dashboard",
        content: "El Dashboard principal te mostrará métricas en tiempo real: ventas del día, productos más vendidos y alertas de stock. Se actualiza automáticamente con cada operación."
      }
    ]
  },
  "ventas-caja": {
    title: "Ventas y Caja",
    description: "Domina el flujo de caja y el registro de operaciones.",
    articles: [
      {
        title: "Registrar una Venta",
        content: "Dirígete al botón 'Nueva Venta'. Puedes usar el lector de código de barras o buscar manualmente. Si el producto no existe, el sistema te permitirá crearlo como un ítem de 'Monto Libre' o 'Varios' al instante."
      },
      {
        title: "Apertura y Cierre de Caja",
        content: "Es recomendable abrir la caja al inicio del turno indicando el saldo inicial (cambio). Al finalizar el día, realiza el 'Cierre de Caja' para obtener el reporte de efectivos, tarjetas y diferencias."
      },
      {
        title: "Anular una Venta",
        content: "Si cometiste un error, puedes buscar la venta en el historial del día y anularla. Esto revertirá el stock y el saldo de la caja automáticamente."
      }
    ]
  },
  "inventario": {
    title: "Inventario y Stock",
    description: "Mantén tu catálogo organizado y al día.",
    articles: [
      {
        title: "Cargar Productos",
        content: "Ve a la sección 'Inventario'. Puedes cargar productos uno a uno definiendo nombre, precio de costo, precio de venta y stock actual. No olvides asignar un código de barras si utilizas escáner."
      },
      {
        title: "Control de Stock Bajo",
        content: "Controlia te avisará cuando un producto esté por debajo del stock mínimo. Puedes configurar este umbral para cada producto individualmente."
      },
      {
        title: "Categorías",
        content: "Organiza tus productos en categorías (ej: Bebidas, Almacén, Limpieza) para facilitar la búsqueda y obtener reportes de ventas segmentados."
      }
    ]
  },
  "suscripcion": {
    title: "Suscripción y Pagos",
    description: "Información sobre tu plan y facturación.",
    articles: [
      {
        title: "Planes Disponibles",
        content: "Contamos con planes Base, Gestión y Avanzado. La principal diferencia radica en la cantidad de usuarios permitidos y el límite de productos en inventario."
      },
      {
        title: "Métodos de Pago",
        content: "Aceptamos todas las tarjetas de crédito y débito a través de Mercado Pago. La suscripción se debita automáticamente de forma mensual."
      },
      {
        title: "¿Qué pasa si no pago?",
        content: "Si el pago falla, tendrás unos días de gracia. Luego, el acceso se bloqueará, pero tus datos permanecerán guardados por 6 meses para cuando decidas volver."
      }
    ]
  }
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const categories = [
    {
      id: "primeros-pasos",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Primeros Pasos",
      description: "Aprende lo básico para configurar tu cuenta."
    },
    {
      id: "ventas-caja",
      icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
      title: "Ventas y Caja",
      description: "Cómo registrar ventas y gestionar tu caja diaria."
    },
    {
      id: "inventario",
      icon: <Package className="w-6 h-6 text-orange-500" />,
      title: "Inventario",
      description: "Gestión de productos, stock y proveedores."
    },
    {
      id: "suscripcion",
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
      title: "Suscripción",
      description: "Dudas sobre planes, pagos y facturación."
    }
  ];

  const faqs = [
    {
      question: "¿Cómo registro mi primera venta?",
      answer: "Dirígete al Dashboard y haz clic en 'Nueva Venta' o scanea un producto con el scanner, esto abrira la ventana de cobro. Selecciona los productos escaneando el código de barras o buscándolos por nombre. Finalmente, elige el método de pago y confirma la operación."
    },
    {
      question: "¿Puedo usar Controlia en mi celular?",
      answer: "¡Sí! Controlia es totalmente responsivo y funciona perfectamente en celulares, tablets y computadoras. Pero con muchas limitaciones, se recomienda usarlo en computadoras."
    },
    {
      question: "¿Cómo reinicio mi contraseña?",
      answer: "En la pantalla de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?'. Te enviaremos un correo con las instrucciones para restablecerla."
    },
    {
      question: "¿Qué pasa si se vence mi suscripción?",
      answer: "Si tu suscripción vence, perderás acceso a las funciones premium, pero tus datos estarán seguros..."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans selection:bg-blue-500/30">
      <Navbar />

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          // --- MAIN VIEW ---
          <motion.div 
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  ¿Cómo podemos ayudarte?
                </h1>
                <p className="text-lg text-gray-400">
                  Encuentra guías, tutoriales y respuestas a las preguntas frecuentes.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto mt-8">
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar un tema (ej: ventas, stock, contraseña)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#18181b] border border-zinc-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xl transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Categories Grid */}
            <section className="container mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Explorar por categorías</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                  <div 
                    key={i}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="group p-6 bg-[#121212] border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-[#1a1a1e] transition-all cursor-pointer"
                  >
                    <div className="mb-4 bg-zinc-900/50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 py-12 max-w-3xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <MessageCircle className="text-blue-500" /> Preguntas Frecuentes
              </h2>
              
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-zinc-900/50 transition-colors"
                      >
                        <span className="font-medium text-gray-200">{faq.question}</span>
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-blue-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      <div 
                        className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                          openFaqIndex === index ? "max-h-40 py-5 opacity-100" : "max-h-0 py-0 opacity-0"
                        }`}
                      >
                        <p className="text-gray-400 text-sm leading-relaxed border-t border-zinc-800/50 pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                      No encontramos resultados para tu búsqueda.
                  </div>
                )}
              </div>
            </section>

             {/* Contact Footer */}
             <section className="container mx-auto px-4 py-16 text-center">
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-900/30 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">¿No encontraste lo que buscabas?</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Nuestro equipo de soporte está disponible para ayudarte a resolver cualquier inconveniente que tengas con la plataforma.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:astralvisionestudio@gmail.com"
                            className="flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-[#202025] border border-zinc-700 rounded-xl text-white font-medium transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Enviar Email
                        </a>
                        <a 
                            href="#"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chatear por WhatsApp
                        </a>
                    </div>
                </div>
              </section>
          </motion.div>
        ) : (
          // --- DETAIL CATEGORY VIEW ---
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="pt-24 pb-20 container mx-auto px-4 max-w-4xl"
          >
             <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
             >
                <div className="p-2 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium">Volver al centro de ayuda</span>
             </button>

             {CATEGORIES_CONTENT[selectedCategory] && (
               <div className="space-y-12">
                  <div className="text-center md:text-left space-y-2">
                     <h1 className="text-4xl font-bold text-white tracking-tight">
                        {CATEGORIES_CONTENT[selectedCategory].title}
                     </h1>
                     <p className="text-xl text-gray-400">
                        {CATEGORIES_CONTENT[selectedCategory].description}
                     </p>
                  </div>

                  <div className="space-y-8">
                     {CATEGORIES_CONTENT[selectedCategory].articles.map((article, i) => (
                        <div key={i} className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 md:p-8 hover:border-zinc-700 transition-colors relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                           <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-500" />
                              {article.title}
                           </h3>
                           <p className="text-gray-400 leading-relaxed text-base">
                              {article.content}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-gray-600 text-sm bg-[#050505]">
        <p>&copy; {new Date().getFullYear()} Controlia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
