import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Users, CreditCard, DollarSign, BarChart } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Gestión de Productos',
    description: 'Administra tu catálogo completo con códigos de barras, categorías, precios y stock en tiempo real.'
  },
  {
    icon: TrendingUp,
    title: 'Control de Inventario',
    description: 'Monitorea niveles de stock, recibe alertas automáticas y optimiza tu inventario para evitar pérdidas.'
  },
  {
    icon: Users,
    title: 'Gestión de Proveedores',
    description: 'Mantén un registro completo de tus proveedores, historial de compras y mejora tus relaciones comerciales.'
  },
  {
    icon: CreditCard,
    title: 'Procesamiento de Pagos',
    description: 'Acepta múltiples métodos de pago: efectivo, tarjetas, transferencias y mantén todo organizado.'
  },
  {
    icon: DollarSign,
    title: 'Cierre de Caja Diario',
    description: 'Cuadra tu caja al final del día con reportes automáticos y conciliación de ingresos y egresos.'
  },
  {
    icon: BarChart,
    title: 'Métricas de Ventas',
    description: 'Analiza el rendimiento de tu negocio con reportes detallados, gráficos y estadísticas en tiempo real.'
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-[#1a1b1e] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">Funcionalidades</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            Todo lo que necesitas para gestionar tu negocio
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Herramientas completas diseñadas específicamente para pequeños negocios que buscan crecer y optimizar sus operaciones.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary-300" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;