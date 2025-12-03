import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Zap } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-[#0f0f12] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-transparent"></div>
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">Empieza en minutos</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Comienza a optimizar tu negocio{' '}
            <span className="bg-gradient-to-r from-primary-300 to-primary-600 bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Únete a cientos de negocios que ya están creciendo con CONTROLIA. 14 días de prueba gratis, sin tarjeta de crédito requerida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-700 text-white group transition-all duration-300 px-8"
            >
              Comenzar gratis
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 px-8"
            >
              Agendar demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Configuración en 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Check = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default CTA;