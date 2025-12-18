"use client";

import MarketingLayout from "../landing/components/MarketingLayout";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center mb-8">
            <Construction className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Próximamente</h1>
          
          <p className="text-xl text-gray-400 mb-8">
            Estamos trabajando duro para traerte esta sección. Vuelve pronto para ver las novedades.
          </p>

          <a href="/" className="text-primary-300 font-medium hover:text-white transition-colors">
            &larr; Volver al inicio
          </a>
        </motion.div>
      </div>
    </MarketingLayout>
  );
}
