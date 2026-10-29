import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, Zap, Check } from 'lucide-react';
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-32 bg-[#07090d] relative overflow-clip isolate">
      {/* Background Decor */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/5 overflow-hidden"><div className="lp-beam" /></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(52,131,250,0.35),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 lp-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,#000,transparent)]" />
      <div className="lp-aurora lp-aurora--violet -z-10 top-[-20%] right-[-10%] w-[500px] h-[500px] opacity-30" />
      <div className="lp-aurora lp-aurora--cyan -z-10 bottom-[-30%] left-[-10%] w-[500px] h-[500px] opacity-25" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
        >
            <div className="lp-float lp-border-glow mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(52,131,250,0.7)]">
              <Zap className="w-9 h-9 text-[#57b4ff] drop-shadow-[0_0_12px_rgba(87,180,255,0.8)]" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-[-0.03em] lp-text-metal">
                ¿Listo para transformar <span className="lp-text-gradient">tu negocio</span>?
            </h2>
            
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Únete a la comunidad de emprendedores que confían en Controlia para gestionar sus operaciones diarias. 
                <span className="text-white font-medium block mt-2">15 días de prueba gratis.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login?register=1">
                    <Button size="lg" className="lp-shine rounded-full bg-gradient-to-b from-white to-slate-200 text-black hover:to-white font-bold px-10 h-14 text-lg shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset,0_15px_50px_-10px_rgba(255,255,255,0.35)]">
                        Comenzar Gratis
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
                <Link href="https://wa.me/541176513862" target="_blank" rel="noopener noreferrer">
                     <Button size="lg" variant="outline" className="rounded-full bg-white/[0.03] backdrop-blur-md border-white/15 text-white hover:bg-white/10 hover:border-white/30 hover:text-white px-10 h-14 text-lg">
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
