"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Camera, Check, Package, ScanBarcode } from 'lucide-react';
import Link from "next/link";

// Productos de ejemplo que "pasan" por el escáner en loop
const PRODUCTS = [
  { name: 'Yerba mate 1 kg', price: 3200, color: 'from-emerald-400 to-emerald-600' },
  { name: 'Gaseosa 2,25 L', price: 2900, color: 'from-red-400 to-rose-600' },
  { name: 'Galletitas dulces', price: 1450, color: 'from-amber-300 to-orange-500' },
  { name: 'Leche entera 1 L', price: 1300, color: 'from-sky-300 to-blue-500' },
];
const SCAN_INTERVAL = 2200;

// Patrón fijo de barras (ancho de cada barra/espacio)
const BARS = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2];

const POINTS = [
  { icon: ScanBarcode, text: 'Enchufás un lector USB y listo: no hay nada que instalar ni configurar' },
  { icon: Package, text: 'Cada producto se suma al ticket y se descuenta del stock en el momento' },
  { icon: Camera, text: '¿Todavía no tenés lector? La cámara del celular también lee el código' },
];

const formatARS = (value: number) => `$${value.toLocaleString('es-AR')}`;

function Barcode() {
  let x = 0;
  return (
    <svg viewBox="0 0 64 28" className="w-full h-full" aria-hidden="true">
      {BARS.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={28} fill="#0b0b0b" /> : null;
        x += w;
        return rect;
      })}
    </svg>
  );
}

const Scanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const reduceMotion = useReducedMotion();
  const [scanned, setScanned] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setScanned(PRODUCTS.length);
      return;
    }
    if (!inView) return;
    const timer = setInterval(() => {
      setScanned((n) => (n >= PRODUCTS.length ? 0 : n + 1));
    }, SCAN_INTERVAL);
    return () => clearInterval(timer);
  }, [inView, reduceMotion]);

  const items = PRODUCTS.slice(0, scanned);
  const total = items.reduce((sum, p) => sum + p.price, 0);
  const current = PRODUCTS[scanned % PRODUCTS.length];
  const justScanned = scanned > 0 ? PRODUCTS[scanned - 1] : null;

  return (
    <section className="relative py-24 bg-[#07090d] overflow-clip">
      <div className="absolute inset-x-0 top-0 lp-hairline" />
      <div className="lp-aurora lp-aurora--blue top-[10%] right-[5%] w-[500px] h-[400px] opacity-30" />
      <div className="lp-aurora lp-aurora--cyan bottom-[0%] left-[0%] w-[400px] h-[300px] opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="lp-border-glow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 mb-6">
              <ScanBarcode className="w-4 h-4 text-[#57b4ff]" />
              <span className="text-sm font-medium text-gray-300">Lector de códigos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.025em]">
              <span className="lp-text-metal">Pasás el código.</span>
              <br />
              <span className="lp-text-gradient">Listo, cobrado.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Pasás el producto por el lector y Controlia lo suma al ticket con su precio. Cuando se te llena el mostrador, cobrás en segundos y sin buscar precios en la lista.
            </p>
            <ul className="space-y-4 max-w-xl mx-auto lg:mx-0 text-left mb-10">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-gray-300">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3483fa]/30 to-[#6d5dfc]/10 ring-1 ring-[#57b4ff]/30">
                    <Icon className="w-4 h-4 text-[#57b4ff]" />
                  </span>
                  <span className="pt-1">{text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login?register=1"
              className="lp-btn-primary lp-shine inline-flex items-center gap-2 rounded-full px-7 h-12 text-white font-semibold"
            >
              Probalo gratis con tu lector
            </Link>
          </motion.div>

          {/* Visual: celular escaneando + ticket */}
          <div ref={ref} className="flex-1 w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">

            {/* Lector de códigos (pistola) apuntando al producto */}
            <div className="relative w-[260px] h-[440px] shrink-0">
              {/* Mango */}
              <div className="absolute left-1/2 top-0 h-[110px] w-[58px] -translate-x-1/2 origin-bottom rotate-[14deg] rounded-t-[1.6rem] rounded-b-lg border border-white/10 bg-gradient-to-b from-[#252b3a] to-[#11141c] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]">
                <span className="absolute -left-2 top-[46px] h-9 w-3 rounded-l-full bg-[#3483fa]/80" />
              </div>
              {/* Cabezal */}
              <div className="absolute left-1/2 top-[92px] h-[64px] w-[170px] -translate-x-1/2 rounded-[1.4rem] border border-white/15 bg-gradient-to-b from-[#2c3346] to-[#151923] shadow-[0_30px_80px_-20px_rgba(52,131,250,0.6)]">
                <span className="absolute left-4 top-3 font-funnel-display text-[10px] font-bold tracking-[0.2em] text-gray-400">CONTROLIA</span>
                <span className={`absolute right-4 top-3 h-2 w-2 rounded-full transition-colors duration-200 ${justScanned ? 'bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.8)]' : 'bg-gray-600'}`} />
                <span className="absolute bottom-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_14px_4px_rgba(239,68,68,0.7)]" />
              </div>

              {/* Haz láser */}
              <div className="lp-flicker absolute left-1/2 top-[150px] h-[176px] w-[180px] -translate-x-1/2 bg-gradient-to-b from-red-500/50 to-red-500/5 [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]" />
              <span className="lp-flicker absolute left-1/2 top-[325px] z-20 h-0.5 w-[170px] -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_12px_3px_rgba(239,68,68,0.8)]" />

              {/* Producto */}
              <div className="absolute left-1/2 top-[270px] w-[150px] -translate-x-1/2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.name}
                    initial={{ opacity: 0, x: -60, rotate: -6 }}
                    animate={{ opacity: 1, x: 0, rotate: -2 }}
                    exit={{ opacity: 0, x: 60, rotate: 6 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35 }}
                    className={`rounded-xl bg-gradient-to-br ${current.color} p-3 shadow-2xl`}
                  >
                    <p className="text-[11px] font-bold text-white/90 mb-6 leading-tight">{current.name}</p>
                    <div className="rounded-md bg-white p-2">
                      <div className="h-10"><Barcode /></div>
                      <p className="mt-1 text-center font-mono text-[9px] tracking-[0.2em] text-black">7790000{scanned}12345</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Confirmación de lectura */}
              <div className="absolute -bottom-2 inset-x-0">
                <AnimatePresence mode="wait">
                  {justScanned && (
                    <motion.div
                      key={scanned}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.25 }}
                      className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40 backdrop-blur-md px-3 py-1.5"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-xs text-emerald-100 font-medium truncate">{justScanned.name} · bip</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Ticket */}
            <div className="lp-border-glow relative w-full max-w-[260px] sm:ml-2 sm:mt-24 rounded-2xl border border-white/10 bg-[#0d1017]/90 backdrop-blur-xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Venta actual</span>
                <span className="font-mono text-[11px] text-gray-500">#0483</span>
              </div>
              <ul className="space-y-2 min-h-[136px]" aria-live="polite">
                <AnimatePresence initial={false}>
                  {items.map((p) => (
                    <motion.li
                      key={p.name}
                      initial={{ opacity: 0, x: -12, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.3 }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-300 truncate pr-2">{p.name}</span>
                      <span className="font-mono tabular-nums text-gray-100">{formatARS(p.price)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <li className="text-sm text-gray-500">Esperando el primer producto…</li>
                )}
              </ul>
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-2xl font-bold font-mono tabular-nums lp-text-metal">{formatARS(total)}</span>
              </div>
              <div className={`flex h-10 items-center justify-center rounded-full text-sm font-semibold text-white transition-all duration-300 ${items.length === PRODUCTS.length ? 'lp-btn-primary' : 'bg-white/[0.06] text-gray-400'}`}>
                {items.length === PRODUCTS.length ? `Cobrar ${formatARS(total)}` : 'Escaneando…'}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Scanner;
