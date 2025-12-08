import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    price: '$0',
    period: '/mes (x 3 meses)',
    description: 'Comienza gratis con nuestra oferta de lanzamiento',
    features: [
      'Hasta 500 productos',
      'Gestión de inventario básica',
      '5 usuarios',
      'Reportes básicos',
      'Soporte por email',
      'Cierres de caja diarios'
    ],
    popular: false
  },
  {
    name: 'Profesional',
    price: '$59',
    period: '/mes',
    description: 'Ideal para negocios en crecimiento',
    features: [
      'Productos ilimitados',
      'Gestión avanzada de inventario',
      '15 usuarios',
      'Reportes avanzados y analytics',
      'Soporte prioritario 24/7',
      'Gestión de proveedores',
      'Múltiples puntos de venta',
      'API de integración'
    ],
    popular: true
  },
  {
    name: 'Empresarial',
    price: '$99',
    period: '/mes',
    description: 'Para negocios que requieren lo máximo',
    features: [
      'Todo lo del plan Profesional',
      'Usuarios ilimitados',
      'Múltiples sucursales',
      'Capacitación personalizada',
      'Gestor de cuenta dedicado',
      'Integraciones personalizadas',
      'Respaldos automáticos diarios',
      'SLA garantizado 99.9%'
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#1a1b1e] to-[#0f0f12] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">Precios</span> */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            Planes diseñados para cada etapa de tu negocio
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sin contratos a largo plazo. Cancela cuando quieras. 14 días de prueba gratis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-gradient-to-br ${
                plan.popular 
                  ? 'from-primary-900/30 to-primary-800/20 border-primary/50' 
                  : 'from-gray-900/50 to-gray-800/30 border-gray-800'
              } backdrop-blur-sm border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 ${
                plan.popular ? 'md:scale-105 md:shadow-[0_10px_30px_rgba(37,99,235,0.08)]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-300 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Más popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-300" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                } transition-all duration-300`}
                size="lg"
              >
                Comenzar ahora
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
            <p className="text-gray-400 text-sm">
            ¿Necesitas un plan personalizado?{' '}
            <button className="text-primary-300 hover:text-primary-200 underline transition-colors">
              Contáctanos
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;