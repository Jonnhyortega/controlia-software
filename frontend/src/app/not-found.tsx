"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="text-center max-w-lg z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 mb-8 shadow-2xl">
           <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">?</span>
        </div>
        
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
          Lo sentimos, parece que la página que buscas se ha movido, eliminado o nunca existió.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            <MoveLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          
          <Link 
            href="/help"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            Centro de ayuda
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-zinc-600 text-sm font-mono">
        Error code: 404_NOT_FOUND
      </div>
    </div>
  );
}
