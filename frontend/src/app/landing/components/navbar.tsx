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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07090d]/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md overflow-hidden">
              <img src="/icon.png" alt="Controlia" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight font-funnel-display lp-text-metal">CONTROLIA</span>
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
            <Link href="https://wa.me/541176513862" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Contacto
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            {token ? (
              <Link href="/dashboard">
                <Button className="lp-btn-primary lp-shine text-white font-medium rounded-full px-4 sm:px-5 whitespace-nowrap">
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
                  <Button className="lp-btn-primary lp-shine text-white rounded-full h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm whitespace-nowrap">
                    Probar gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="lp-hairline opacity-60" />
    </nav>
  );
}
