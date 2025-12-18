"use client";

import Link from "next/link";
import { Button } from "../../dashboard/components/button";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#1a1b1e]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#1a1b1e]/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden">
              <img src="/icon.png" alt="Controlia" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CONTROLIA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Características
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Precios
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sobre nosotros
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Contacto
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary-700 text-white font-medium">
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/login?register=1">
                  <Button className="bg-primary hover:bg-primary-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.28)] hover:shadow-[0_0_25px_rgba(37,99,235,0.38)] transition-all duration-300">
                    Comenzar Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
