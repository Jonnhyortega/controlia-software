import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Zap, Check } from 'lucide-react';
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 to-[#050505] border-y border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
        >
            <Zap className="w-16 h-16 text-primary mx-auto mb-8 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                ¿Listo para transformar tu negocio?
            </h2>
            
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Únete a la comunidad de emprendedores que confían en Controlia para gestionar sus operaciones diarias. 
                <span className="text-white font-medium block mt-2">15 días de prueba gratis.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login?register=1">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-10 h-14 text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        Comenzar Gratis
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
                <Link href="/contact">
                     <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 px-10 h-14 text-lg">
                        Hablar con Ventas
                    </Button>
                </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500">
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
