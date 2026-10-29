"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useReducedMotion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, BarChart3, CheckCircle2, Package, Plus, Receipt, Sparkles, Wallet } from 'lucide-react';
import Link from "next/link";

// Demo interactiva de la captura: cada "venta" suma al total y muestra un beneficio
const BASE_TOTAL = 145200;
const YESTERDAY_TOTAL = BASE_TOTAL / 1.24;
const DEMO_SALES = [12400, 8750, 23100, 5600, 17300];
const DEMO_BENEFITS = [
  { icon: Package, text: 'El stock se descontó solo' },
  { icon: Receipt, text: 'Ticket listo para el cliente' },
  { icon: Wallet, text: 'La caja del día ya lo sumó' },
  { icon: BarChart3, text: 'Quedó en tus reportes de ventas' },
];
const CTA_EVERY = 3;

const formatARS = (value: number) => `$${Math.round(value).toLocaleString('es-AR')}`;

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [total, setTotal] = useState(BASE_TOTAL);
  const [displayTotal, setDisplayTotal] = useState(BASE_TOTAL);
  const [clicks, setClicks] = useState(0);
  const [toast, setToast] = useState<{ id: number; kind: 'benefit' | 'cta'; benefit: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayTotal(total);
      return;
    }
    const controls = animate(displayTotal, total, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: setDisplayTotal,
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, reduceMotion]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const handleAddSale = () => {
    const next = clicks + 1;
    const isCta = next % CTA_EVERY === 0;
    const benefitsShown = next - Math.floor(next / CTA_EVERY);

    setClicks(next);
    setTotal((prev) => prev + DEMO_SALES[(next - 1) % DEMO_SALES.length]);
    setToast({
      id: next,
      kind: isCta ? 'cta' : 'benefit',
      benefit: (benefitsShown - 1) % DEMO_BENEFITS.length,
    });

    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), isCta ? 6000 : 3000);
  };

  const growth = Math.round((total / YESTERDAY_TOTAL - 1) * 100);
  const ToastIcon = toast?.kind === 'benefit' ? DEMO_BENEFITS[toast.benefit].icon : Sparkles;

  return (
    <section className="relative isolate overflow-clip bg-[#07090d] pt-24 pb-32">
      {/* Background: grilla técnica + auroras */}
      <div className="absolute inset-0 -z-10 lp-grid" />
      <div className="lp-aurora lp-aurora--blue -z-10 top-[-20%] left-[10%] w-[700px] h-[500px]" />
      <div className="lp-aurora lp-aurora--violet -z-10 top-[10%] right-[-10%] w-[600px] h-[500px]" />
      <div className="lp-aurora lp-aurora--cyan -z-10 bottom-[-25%] left-[35%] w-[500px] h-[400px] opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-40 -z-10 bg-gradient-to-b from-transparent to-[#0F0F12]" />
      
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
              className="lp-border-glow inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-gray-300 font-medium tracking-wide">Para kioscos, almacenes y comercios de barrio</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.05] tracking-[-0.03em]">
              <span className="lp-text-metal">Cerrá la caja</span> <br className="hidden lg:block"/>
              <span className="lp-text-gradient">
                sabiendo cuánto ganaste.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Cobrás pasando el código por el lector, el stock se descuenta solo y los fiados quedan anotados con nombre y monto. Chau cuaderno, chau planillas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href={isLoggedIn ? "/dashboard" : "/login?register=1"} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="lp-btn-primary lp-shine w-full sm:w-auto px-8 py-6 text-lg text-white rounded-full group"
                >
                  {isLoggedIn ? 'Ir a mi Panel' : 'Probalo 15 días gratis'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/#features" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-6 text-lg rounded-full bg-white/[0.03] border-white/15 hover:bg-white/10 hover:border-white/30 text-gray-200 hover:text-white backdrop-blur-md transition-all font-medium"
                >
                  Ver cómo funciona
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> Sin tarjeta de crédito
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> Desde el celu o la compu
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> Cancelás cuando quieras
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
             <div className="relative group lp-tilt">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#3483fa]/40 via-[#7c3aed]/30 to-[#06b6d4]/30 rounded-2xl blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
                <div className="lp-border-glow relative rounded-xl overflow-hidden border border-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] bg-[#0d1017]">
                   {/* Header Fake UI */}
                   <div className="h-8 bg-gradient-to-b from-[#161a23] to-[#11141b] border-b border-white/5 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   </div>
                   {/* Main Image */}
                   <img 
                    src="/dashboard-hero.png" 
                    alt="Controlia Dashboard Preview" 
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                   />
                   
                   {/* Floating Badge */}
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 1, duration: 0.5 }}
                     className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-[#07090d]/60 backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-2.5 sm:p-4 rounded-lg flex items-center gap-2.5 sm:gap-4 shadow-[0_20px_60px_-15px_rgba(52,131,250,0.45)]"
                   >
                      <div className="hidden sm:block bg-gradient-to-br from-emerald-400/30 to-emerald-600/10 ring-1 ring-emerald-400/30 p-2 rounded-md">
                        <BarChart3 className="text-green-500 w-6 h-6" />
                      </div>
                      <div className="whitespace-nowrap">
                        <p className="text-white font-bold text-xs sm:text-sm">Ventas hoy</p>
                        <p className="text-green-400 font-mono text-[11px] sm:text-xs tabular-nums">+{growth}% vs ayer</p>
                      </div>
                      <div className="ml-auto font-bold text-sm sm:text-lg font-mono tabular-nums lp-text-metal">
                        {formatARS(displayTotal)}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSale}
                        aria-label="Agregar una venta de prueba"
                        className="lp-btn-primary lp-shine relative shrink-0 inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57b4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090d]"
                      >
                        {clicks === 0 && (
                          <span className="absolute inset-0 rounded-full ring-2 ring-[#57b4ff]/70 animate-ping motion-reduce:hidden" aria-hidden="true" />
                        )}
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar<span className="hidden sm:inline"> venta</span></span>
                      </button>

                      {/* Notificación de la demo */}
                      <div className="absolute left-0 right-0 bottom-[calc(100%+0.75rem)] flex justify-center pointer-events-none" aria-live="polite">
                        <AnimatePresence mode="wait">
                          {toast && (
                            <motion.div
                              key={toast.id}
                              initial={{ opacity: 0, y: 10, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.98 }}
                              transition={{ duration: reduceMotion ? 0 : 0.25 }}
                              className="pointer-events-auto flex items-center gap-2 sm:gap-3 max-w-full rounded-2xl sm:rounded-full border border-white/10 bg-[#0d1017]/85 backdrop-blur-xl px-3 sm:px-4 py-2 shadow-[0_15px_40px_-10px_rgba(52,131,250,0.6)]"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#57b4ff] to-[#6d5dfc]">
                                <ToastIcon className="w-3.5 h-3.5 text-white" />
                              </span>
                              {toast.kind === 'benefit' ? (
                                <span className="text-xs sm:text-sm text-gray-100 font-medium">{DEMO_BENEFITS[toast.benefit].text}</span>
                              ) : (
                                <span className="text-xs sm:text-sm text-gray-100 font-medium">
                                  Así se vende con Controlia.{' '}
                                  <Link href="/login?register=1" className="lp-text-gradient font-semibold whitespace-nowrap hover:underline">
                                    Probalo gratis →
                                  </Link>
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
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
