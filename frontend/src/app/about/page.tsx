"use client";

import MarketingLayout from "../landing/components/MarketingLayout";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Sobre Nosotros</h1>
          
          <div className="prose prose-invert prose-lg">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              En Controlia, nuestra misión es democratizar el acceso a herramientas de gestión empresarial de alta calidad para pequeños y medianos negocios en Latinoamérica.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Nuestra Historia</h2>
            <p className="text-gray-400 mb-6">
              Nacimos con la idea de que la tecnología no debería ser una barrera para el crecimiento, sino un catalizador. Vimos cómo muchos dueños de negocios luchaban con hojas de cálculo desordenadas y sistemas costosos y poco intuitivos, y decidimos crear algo diferente.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Lo que nos mueve</h2>
            <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-8">
              <li><strong>Simplicidad:</strong> Creemos que el software debe ser fácil de usar desde el primer día.</li>
              <li><strong>Transparencia:</strong> Sin costos ocultos ni contratos forzosos.</li>
              <li><strong>Comunidad:</strong> Crecemos junto con nuestros usuarios, escuchando sus necesidades.</li>
            </ul>

            {/* <div className="bg-primary/10 border border-primary/20 rounded-md p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">¿Te gustaría formar parte?</h3>
              <p className="text-gray-400 mb-6">Estamos siempre buscando talento apasionado.</p>
              <a href="/careers" className="text-primary-300 font-semibold hover:underline">Ver vacantes abiertas &rarr;</a>
            </div> */}
          </div>
        </motion.div>
      </div>
    </MarketingLayout>
  );
}
