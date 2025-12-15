"use client";

import MarketingLayout from "../landing/components/MarketingLayout";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Política de Privacidad</h1>
          <p className="text-gray-500 mb-12">Última actualización: 15 de Diciembre, 2025</p>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Introducción</h2>
              <p>
                En Controlia, nos tomamos muy en serio su privacidad. Esta política describe cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestro software y servicios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Información que recopilamos</h2>
              <p>
                Podemos recopilar información que usted nos proporciona directamente, como su nombre, dirección de correo electrónico, nombre de la empresa y datos de facturación cuando se registra en una cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Uso de la información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Proporcionar y mantener nuestro servicio.</li>
                <li>Notificarle sobre cambios en nuestro servicio.</li>
                <li>Brindar soporte al cliente y recopilar análisis para mejorar el software.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Seguridad de los datos</h2>
              <p>
                La seguridad de sus datos es importante para nosotros, pero recuerde que ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. Nos esforzamos por utilizar medios comercialmente aceptables para proteger su información.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </MarketingLayout>
  );
}
