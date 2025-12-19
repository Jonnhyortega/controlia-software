"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, BarChart3, Rocket, CheckCircle2 } from 'lucide-react';
import Link from "next/link";

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0a0a0c] pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10 opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-gray-300 font-medium tracking-wide">La solución preferida por PyMEs</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Gestiona tu negocio <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-400 to-primary-400 animate-gradient-x">
                sin límites
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Dile adiós a las planillas de cálculo. Controlia centraliza tus ventas, stock, clientes y finanzas en una plataforma intuitiva diseñada para escalar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href={isLoggedIn ? "/dashboard" : "/login?register=1"} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_-10px_rgba(var(--primary-rgb),0.5)] group transition-all duration-300"
                >
                  {isLoggedIn ? 'Ir a mi Panel' : 'Comenzar Gratis'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/#features" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-6 text-lg border-white/10 hover:bg-white/5 text-gray-300 transition-all font-medium"
                >
                  Ver Funcionalidades
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> Sin tarjeta de crédito
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> Setup en 2 minutos
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> Cancelación flexible
               </div>
            </div>
          </motion.div>

          {/* Right Image/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
             <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-600/30 rounded-xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-70"></div>
                <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#121214]">
                   {/* Header Fake UI */}
                   <div className="h-8 bg-[#1a1a1e] border-b border-white/5 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   </div>
                   {/* Main Image */}
                   <img 
                    src="https://horizons-cdn.hostinger.com/e059da5a-bba4-4792-8c52-5124e2066510/8e0b5fe3bf6a4225c669e58fc0a53acf.png" 
                    alt="Controlia Dashboard Preview" 
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                   />
                   
                   {/* Floating Badge */}
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 1, duration: 0.5 }}
                     className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-md flex items-center gap-4 shadow-xl"
                   >
                      <div className="bg-green-500/20 p-2 rounded-md">
                        <BarChart3 className="text-green-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Ventas hoy</p>
                        <p className="text-green-400 font-mono text-xs">+24% vs ayer</p>
                      </div>
                      <div className="ml-auto text-white font-bold text-lg">
                        $145.200
                      </div>
                   </motion.div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
