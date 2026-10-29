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
    title: 'Cobrá en segundos',
    description: 'Pasás el código con la cámara del celular o con un lector, y el ticket sale al toque. Para la hora pico, cuando se te llena el mostrador.',
    color: 'from-blue-500 to-indigo-500',
    colSpan: 'md:col-span-2'
  },
  {
    icon: Package,
    title: 'Sabé qué reponer',
    description: 'Cada venta descuenta el stock. Ves qué se está acabando antes de que un cliente te lo pida y no lo tengas.',
    color: 'from-emerald-500 to-teal-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: DollarSign,
    title: 'La caja que cierra',
    description: 'Abrís y cerrás la caja con el resumen del día: lo que vendiste, lo que gastaste y lo que tiene que haber en el cajón.',
    color: 'from-orange-500 to-red-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: Users,
    title: 'Fiados sin cuaderno',
    description: 'Cada cliente con su cuenta: lo que se llevó, lo que pagó y lo que debe. Se terminan los tachones y las discusiones de "yo te pagué".',
    color: 'from-purple-500 to-pink-500',
    colSpan: 'md:col-span-2'
  },
  {
    icon: ShieldCheck,
    title: 'Vos decidís quién toca qué',
    description: 'Creás usuarios para tus empleados y elegís qué pueden ver o cambiar. Atienden el mostrador, pero la plata la controlás vos.',
    color: 'from-cyan-500 to-blue-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: BarChart3,
    title: 'Qué sale y qué no',
    description: 'Reportes simples para ver qué productos se venden más y cómo vienen las ventas, sin ser contador.',
    color: 'from-violet-500 to-purple-500',
    colSpan: 'md:col-span-1'
  },
  {
    icon: Palette,
    title: 'Con la cara de tu negocio',
    description: 'Tu logo en los tickets y el tema claro u oscuro, como más te guste.',
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
            <span className="text-sm font-medium text-gray-300">Lo que pasa en tu mostrador</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.025em]">
            <span className="lp-text-metal">Todo el mostrador,</span> <br/>
            <span className="lp-text-gradient">
              en una sola pantalla.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Pensado para el que atiende, repone y cierra la caja. Sin cursos ni manuales: si sabés usar WhatsApp, sabés usar Controlia.
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
