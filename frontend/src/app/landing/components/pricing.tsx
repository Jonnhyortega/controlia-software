import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, Sparkles } from 'lucide-react';
import Link from "next/link";

const plans = [
  {
    name: 'Emprendedor',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para empezar. Totalmente gratis durante la beta.',
    features: [
      'Hasta 100 productos',
      '1 usuario',
      'Control de stock básico',
      'Reportes de ventas simples',
      'Soporte por email'
    ],
    popular: false
  },
  {
    name: 'Crecimiento',
    price: '$29',
    period: '/mes',
    description: 'Para negocios que están escalando sus operaciones.',
    features: [
      'Productos ilimitados',
      '3 usuarios',
      'Control de stock avanzado',
      'Reportes detallados y exportables',
      'Soporte prioritario',
      'Gestión de proveedores'
    ],
    popular: true
  },
  {
    name: 'Empresarial',
    price: '$99',
    period: '/mes',
    description: 'Soluciones a medida para grandes volúmenes.',
    features: [
      'Todo lo del plan Crecimiento',
      'Usuarios ilimitados',
      'Múltiples sucursales',
      'API Access',
      'Gerente de cuenta dedicado',
      'SLA garantizado'
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <section className="py-24 bg-[#1a1b1e] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Precios simples y transparentes
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Puedes cambiar o cancelar en cualquier momento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary/50 ring-1 ring-primary/20 scale-105 shadow-xl' 
                  : 'border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Más popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 ml-2 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 min-h-[200px]">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login?register=1" className="block w-full">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary-700 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Elegir {plan.name}
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
