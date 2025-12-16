import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Zap, Check } from 'lucide-react';
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-24 bg-[#0f0f12] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <Zap className="w-12 h-12 text-primary mx-auto mb-8" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto">
                ¿Listo para transformar tu negocio?
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Únete a la comunidad de emprendedores que confían en Controlia para gestionar sus operaciones diarias. 3 meses de prueba gratis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login?register=1">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8 h-12">
                        Comenzar Gratis
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
                <Link href="/contact">
                     <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800 px-8 h-12">
                        Hablar con Ventas
                    </Button>
                </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Sin tarjeta de crédito</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Setup instantáneo</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Soporte incluido</span>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
