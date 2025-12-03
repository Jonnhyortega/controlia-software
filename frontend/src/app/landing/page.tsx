"use client";

import { BarChart3, ShoppingCart, Package, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "../dashboard/components/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Hero from "./components/hero";
import Pricing from "./components/pricing"
import CallToAction from "./components/callToAction"
import CTA from "./components/cta"
import Footer from "./components/footer"
import Features from "./components/features"

export default function LandingPage() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);
  return (
    <main className="flex flex-col min-h-screen bg-[#1a1b1e] text-gray-100 font-sans selection:bg-primary/30">
      
      {/* Modern Header/Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#1a1b1e]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#1a1b1e]/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CONTROLIA</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Precios
              </a>
              <a href="#contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Contacto
              </a>
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

      {/* Page Sections */}
      <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <Hero isLoggedIn={!!token} />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="contact">
          <CTA />
        </div>
        <Footer />
      </div>
    </main>
  );
}
