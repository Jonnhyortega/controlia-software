"use client";

import Navbar from "../landing/components/navbar";
import { Cookie, Info, Settings, ShieldCheck, ToggleLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-500/10 mb-8 border border-blue-500/20">
            <Cookie className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-6">
          Política de Cookies
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia, personalizar contenido y analizar nuestro tráfico. Aquí te explicamos cómo funcionan.
        </p>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
        
        {/* Section 1 */}
        <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-blue-500" />
                ¿Qué son las cookies?
            </h2>
            <p className="text-gray-400 leading-relaxed">
                Las cookies son pequeños archivos de texto que los sitios web que visitas guardan en tu ordenador o dispositivo móvil. Permiten que el sitio web recuerde tus acciones y preferencias (como inicio de sesión, idioma, tamaño de fuente y otras preferencias de visualización) durante un período de tiempo, para que no tengas que volver a introducirlas cada vez que regreses al sitio o navegues de una página a otra.
            </p>
        </div>

        {/* Section 2: Types of Cookies */}
        <div>
            <h2 className="text-2xl font-bold text-white mb-8 pl-2 border-l-4 border-blue-500">
                Tipos de cookies que utilizamos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#121212]/50 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <h3 className="font-bold text-lg text-gray-200">Esenciales</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                        Necesarias para que el sitio web funcione. Incluyen, por ejemplo, cookies que te permiten iniciar sesión en áreas seguras de nuestro sitio web, usar un carrito de compras o hacer uso de servicios de facturación electrónica.
                    </p>
                </div>

                <div className="bg-[#121212]/50 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-5 h-5 text-purple-500" />
                        <h3 className="font-bold text-lg text-gray-200">Funcionales</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                        Se utilizan para reconocerte cuando regresas a nuestro sitio web. Esto nos permite personalizar nuestro contenido para ti, saludarte por tu nombre y recordar tus preferencias (por ejemplo, tu elección de idioma o región).
                    </p>
                </div>

                <div className="bg-[#121212]/50 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">A</div>
                        <h3 className="font-bold text-lg text-gray-200">Analíticas</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                        Nos permiten reconocer y contar el número de visitantes y ver cómo se mueven los visitantes por nuestro sitio web cuando lo están utilizando. Esto nos ayuda a mejorar la forma en que funciona nuestro sitio web, por ejemplo, asegurando que los usuarios encuentren lo que buscan fácilmente.
                    </p>
                </div>
            </div>
        </div>

        {/* Section 3: Management */}
        <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ToggleLeft className="w-6 h-6 text-blue-500" />
                Cómo controlar las cookies
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya están en tu ordenador y puedes configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si haces esto, es posible que tengas que ajustar manualmente algunas preferencias cada vez que visites un sitio y que algunos servicios y funcionalidades no funcionen.
            </p>
            <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                    <strong>Nota:</strong> Nuestro sistema de autenticación y seguridad requiere cookies esenciales para funcionar. Desactivarlas podría impedirte acceder a tu cuenta de Controlia.
                </p>
            </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-gray-600 text-sm bg-[#050505] mt-12">
        <p>&copy; {new Date().getFullYear()} Controlia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
