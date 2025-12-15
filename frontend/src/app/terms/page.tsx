"use client";

import MarketingLayout from "../landing/components/MarketingLayout";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Términos y Condiciones</h1>
          <p className="text-gray-500 mb-12">Última actualización: 15 de Diciembre, 2025</p>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de los términos</h2>
              <p>
                Al acceder y utilizar Controlia, usted acepta estar sujeto a estos Términos y Condiciones y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar este sitio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Licencia de uso</h2>
              <p>
                Se concede permiso para utilizar temporalmente el software Controlia para operaciones comerciales internas. Esta es la concesión de una licencia, no una transferencia de título.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Renuncia</h2>
              <p>
                Los materiales en el sitio web de Controlia se proporcionan "tal cual". Controlia no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </MarketingLayout>
  );
}
