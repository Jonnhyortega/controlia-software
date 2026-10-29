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
    title: 'Ventas a la Velocidad de la Luz',
    description: 'No hagas esperar a tus clientes. Nuestro POS está optimizado para procesar transacciones en segundos, con lector de códigos y tickets instantáneos.',
    color: 'from-blue-500 to-indigo-500',
    colSpan: 'md:col-span-2'
  },
  {
    icon: Package,
    title: 'Stock Cero-Errores',
    description: 'Olvídate de contar manualmente. El inventario se actualiza en tiempo real con cada venta. Recibe alertas inteligentes antes de quedarte sin mercadería.',
    color: 'from-emerald-500 to-teal-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: DollarSign,
    title: 'Finanzas Claras',
    description: '¿Dónde está tu dinero? Visualiza tu ganancia real diaria, controla la caja chica y registra gastos sin ser contador.',
    color: 'from-orange-500 to-red-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: Users,
    title: 'Gestión de Clientes & Fiados',
    description: 'Fideliza a tus clientes con cuentas corrientes. Registra fiados y pagos parciales de forma segura y organizada. Adiós al cuaderno.',
    color: 'from-purple-500 to-pink-500',
    colSpan: 'md:col-span-2'
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad Militar',
    description: 'Tus datos están encriptados. Define roles para tus empleados y controla qué pueden ver o modificar.',
    color: 'from-cyan-500 to-blue-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: BarChart3,
    title: 'Tu Negocio en Números',
    description: 'Toma decisiones informadas. Identifica tus productos estrella, horas pico y días más rentables con un clic.',
    color: 'from-violet-500 to-purple-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: Palette,
    title: 'Identidad Propia',
    description: 'Tu marca importa. Personaliza los tickets con tu logo, elige tu tema (Oscuro/Claro) y haz que el sistema se sienta tuyo.',
    color: 'from-pink-500 to-rose-500',
    colSpan: 'md:col-span-1'
  }
];

const trackSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
};

const Features = () => {
  return (
    <section className="py-24 bg-[#0F0F12] relative overflow-clip">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 lp-dots [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000,transparent)]" />
        <div className="lp-aurora lp-aurora--blue top-[-10%] left-[-10%] w-[40%] h-[40%] opacity-30" />
        <div className="lp-aurora lp-aurora--violet bottom-[-10%] right-[-10%] w-[40%] h-[40%] opacity-25" />
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
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.025em]">
            <span className="lp-text-metal">Todo lo que necesitas,</span> <br/>
            <span className="lp-text-gradient">
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
              whileHover={{ y: -4 }}
              onMouseMove={trackSpotlight}
              className={`
                ${feature.colSpan} 
                lp-spotlight group relative overflow-hidden rounded-xl border border-white/[0.08] p-8 
                transition-colors duration-300 hover:border-white/[0.14]
              `}
            >
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br ${feature.color}`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mb-6 
                  bg-gradient-to-br ${feature.color} ring-1 ring-white/20 shadow-[0_8px_30px_-6px_rgba(52,131,250,0.5)] group-hover:scale-110 transition-transform duration-500
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
