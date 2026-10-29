import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, Sparkles } from 'lucide-react';
import Link from "next/link";
import { PLAN_LIMITS } from '@/constants/planLimits';
const plans = [
  {
    name: 'Plan Base',
    price: '$25.000',
    period: '/mes',
    description: 'Para el kiosco o almacén que quiere dejar el cuaderno y empezar a ordenarse.',
    features: [
      `Hasta ${PLAN_LIMITS.basic.products} productos`,
      `Hasta ${PLAN_LIMITS.basic.users} usuario`,
      `Hasta ${PLAN_LIMITS.basic.suppliers} proveedores`,
      `Hasta ${PLAN_LIMITS.basic.monthlySales} ventas por mes`,
      'Ventas y Stock en tiempo real',
      'Reportes básicos',
      'Soporte por email'
    ],
    popular: false
  },
  {
    name: 'Plan Gestión',
    price: '$59.000',
    period: '/mes',
    description: 'Para el comercio con empleados, fiados y más movimiento en el mostrador.',
    features: [
      `Hasta ${PLAN_LIMITS.gestion.products} productos`,
      `Hasta ${PLAN_LIMITS.gestion.users} usuarios`,
      `Hasta ${PLAN_LIMITS.gestion.suppliers} proveedores`,
      `Hasta ${PLAN_LIMITS.gestion.monthlySales} ventas por mes`,
      'Gestión financiera avanzada',
      'Cuentas corrientes (Fiados)',
      'Personalización de marca',
      'Soporte prioritario WhatsApp'
    ],
    popular: true
  },

];

const Pricing = () => {
  return (
    <section className="py-24 bg-[#0b0d12] relative overflow-clip">
      <div className="absolute inset-x-0 top-0 lp-hairline" />
      <div className="absolute inset-0 lp-grid opacity-60 pointer-events-none" />
      <div className="lp-aurora lp-aurora--blue left-1/2 -translate-x-1/2 top-[20%] w-[700px] h-[400px] opacity-25" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-[-0.025em] lp-text-metal">
            Un precio claro, sin sorpresas
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Probás 15 días gratis en tu mostrador y después elegís. Sin contratos: cancelás cuando quieras.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative w-full md:max-w-sm backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular 
                  ? 'lp-border-glow border-transparent bg-gradient-to-b from-[#3483fa]/[0.12] via-[#0e1220]/80 to-[#0e1220]/80 md:scale-105 shadow-[0_30px_100px_-30px_rgba(52,131,250,0.6)]' 
                  : 'border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 lp-btn-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Más popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold tracking-tight tabular-nums ${plan.popular ? 'lp-text-gradient' : 'lp-text-metal'}`}>{plan.price}</span>
                  <span className="text-gray-500 ml-2 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 min-h-[200px]">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/25 to-emerald-600/10 ring-1 ring-emerald-400/30">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login?register=1" className="block w-full">
                <Button 
                  className={`w-full h-11 rounded-full ${
                    plan.popular 
                      ? 'lp-btn-primary lp-shine text-white' 
                      : 'bg-white/[0.06] hover:bg-white/[0.12] ring-1 ring-white/10 text-white'
                  }`}
                >
                  Empezar con {plan.name}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
