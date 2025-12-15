import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  Users, 
  ScanBarcode, 
  DollarSign, 
  BarChart3, 
  ShieldCheck, 
  Palette,
  Smartphone,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: ScanBarcode,
    title: 'Punto de Venta Ultra-Rápido',
    description: 'Vende en segundos con nuestro POS optimizado. Compatible con lectores de código de barras y tickets.',
    color: 'from-blue-500 to-indigo-500',
    colSpan: 'md:col-span-2'
  },
  {
    icon: Package,
    title: 'Inventario Inteligente',
    description: 'Control total de stock. Alertas automáticas de stock bajo y reporte de movimientos.',
    color: 'from-emerald-500 to-teal-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: DollarSign,
    title: 'Control Financiero',
    description: 'Cierre de caja diario, registro de gastos y cálculo automático de ganancias.',
    color: 'from-orange-500 to-red-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: Users,
    title: 'CRM & Proveedores',
    description: 'Gestiona deudas de clientes (fiado) y cuentas corrientes con proveedores en un solo lugar.',
    color: 'from-purple-500 to-pink-500',
    colSpan: 'md:col-span-2'
  },
  {
    icon: ShieldCheck,
    title: 'Roles y Seguridad',
    description: 'Crea cuentas para empleados con permisos limitados. Protege tu información sensible.',
    color: 'from-cyan-500 to-blue-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: BarChart3,
    title: 'Reportes Detallados',
    description: 'Toma decisiones basadas en datos reales. Gráficos de ventas, productos más vendidos y más.',
    color: 'from-violet-500 to-purple-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: Palette,
    title: 'Personalización Total',
    description: 'Modo oscuro/claro, logo de tu negocio en tickets y dashboard adaptable.',
    color: 'from-pink-500 to-rose-500',
    colSpan: 'md:col-span-1'
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-[#0F0F12] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 text-amber-400" fill="currentColor" />
            <span className="text-sm font-medium text-gray-300">Potencia tu negocio</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Todo lo que necesitas, <br/>
            <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              sin la complejidad
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Hemos analizado las necesidades reales de los negocios modernos para crear una suite de herramientas que realmente usarás.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`
                ${feature.colSpan} 
                group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 
                hover:bg-white/[0.07] transition-all duration-300
              `}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                  bg-gradient-to-br ${feature.color} shadow-lg shadow-black/20
                `}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
