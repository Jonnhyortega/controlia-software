"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, BarChart3, Rocket } from 'lucide-react';
import Link from "next/link";

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0f12] to-[#1a1b1e] pt-20 pb-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
            >
              <Rocket className="w-4 h-4 text-primary-300" />
              <span className="text-sm text-primary-300 font-medium">Versión 2.0 disponible</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Controla tu{' '}
              <span className="bg-gradient-to-r from-primary-300 to-primary-600 bg-clip-text text-transparent">
                negocio
              </span>{' '}
              sin complicaciones
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-xl">
              La plataforma integral para PyMEs y emprendedores. Facturación, inventario, clientes y reportes en una sola plataforma intuitiva.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={isLoggedIn ? "/dashboard" : "/login?register=1"}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary-700 text-white group transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {isLoggedIn ? 'Ir al Dashboard' : 'Prueba gratis por 3 meses'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/#features">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
                >
                  Conocer más
                </Button>
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 font-medium">
              No se requiere tarjeta de crédito • Cancelación en cualquier momento
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 grid grid-cols-3 gap-4 md:flex md:items-center md:gap-8"
            >
              <div className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">1000+</div>
                <div className="text-xs md:text-sm text-gray-400">Usuarios felices</div>
              </div>
              <div className="hidden md:block h-12 w-px bg-gray-700"></div>
              <div className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
                <div className="text-xs md:text-sm text-gray-400">Soporte</div>
              </div>
              <div className="hidden md:block h-12 w-px bg-gray-700"></div>
              <div className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
                <div className="text-xs md:text-sm text-gray-400">Seguro</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl"></div>
            <img 
              src="https://horizons-cdn.hostinger.com/e059da5a-bba4-4792-8c52-5124e2066510/8e0b5fe3bf6a4225c669e58fc0a53acf.png"
              alt="CONTROLIA Dashboard" 
              className="relative rounded-2xl shadow-2xl border border-gray-800 w-full hover:scale-[1.02] transition-transform duration-500"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
    </section>
  );
};

export default Hero;
