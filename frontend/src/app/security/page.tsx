"use client";

import Navbar from "../landing/components/navbar";
import { Shield, Lock, Server, RefreshCw, Eye, CheckCircle2, AlertTriangle, FileKey } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      title: "Encriptación de Datos",
      description: "Todos los datos sensibles viajan encriptados mediante protocolos SSL/TLS de última generación, asegurando que nadie pueda interceptar tu información."
    },
    {
      icon: <Server className="w-8 h-8 text-green-500" />,
      title: "Infraestructura Segura",
      description: "Nuestros servidores están alojados en centros de datos de clase mundial con certificaciones ISO 27001, garantizando la máxima disponibilidad y protección física."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-purple-500" />,
      title: "Backups Automáticos",
      description: "Realizamos copias de seguridad diarias de toda tu información. En caso de cualquier eventualidad, tu negocio puede seguir operando sin pérdida de datos."
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: "Pagos Protegidos",
      description: "Procesamos todos los pagos a través de Mercado Pago, cumpliendo con los estándares PCI-DSS. Nosotros nunca almacenamos los datos de tu tarjeta."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
             <Shield className="w-4 h-4 text-green-500" />
             <span className="text-sm font-medium text-green-400">Tu seguridad es nuestra prioridad</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Protegemos lo más valioso: <br className="hidden md:block" />
            <span className="text-blue-500">Tu Negocio</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            En Controlia, la seguridad no es una característica opcional, es la base de todo lo que construimos. Conoce cómo mantenemos tu información a salvo.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {securityFeatures.map((feature, i) => (
            <div 
              key={i}
              className="bg-[#121212] border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-colors group"
            >
              <div className="bg-zinc-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Detail Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-0"></div>
           
           <div className="grid md:grid-cols-2 gap-12 relative z-10 items-center">
              <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Monitoreo y Transparencia</h3>
                  <ul className="space-y-4">
                      <li className="flex gap-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                          <span className="text-gray-300">Auditorías de seguridad periódicas.</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                          <span className="text-gray-300">Monitoreo de actividad sospechosa 24/7.</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                          <span className="text-gray-300">Autenticación segura con tokens JWT.</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                          <span className="text-gray-300">Protección contra ataques DDoS y de fuerza bruta.</span>
                      </li>
                  </ul>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                      <FileKey className="w-5 h-5 text-yellow-500" />
                      <span className="font-mono text-sm text-gray-300">security_log.txt</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-green-400">
                      <p>&gt; System check initiated...</p>
                      <p>&gt; Verifying SSL certificates... [OK]</p>
                      <p>&gt; Database firewall active... [OK]</p>
                      <p>&gt; Encrypted connection established.</p>
                      <p className="animate-pulse">&gt; _System secure.</p>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="container mx-auto px-4 py-12 text-center max-w-2xl">
         <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 mb-6">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
         </div>
         <h3 className="text-xl font-bold text-white mb-2">Reportar una vulnerabilidad</h3>
         <p className="text-gray-400 mb-6">
            Si crees haber encontrado una falla de seguridad en nuestra plataforma, por favor repórtala de inmediato para que podamos solucionarla.
         </p>
         <a href="mailto:security@controlia.com" className="text-blue-400 font-medium hover:underline">
            security@controlia.com
         </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-gray-600 text-sm bg-[#050505] mt-12">
        <p>&copy; {new Date().getFullYear()} Controlia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
