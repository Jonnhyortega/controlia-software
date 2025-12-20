"use client";

import { motion } from "framer-motion";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator"; 
import { CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

// Normally fetch this from API or shared constant
const PLANS = {
  basic: {
    name: "Plan Base",
    price: 25000,
    features: ["300 operaciones", "100 productos", "1 usuario"],
    color: "text-green-500"
  },
  gestion: {
    name: "Plan Gestión",
    price: 59000,
    features: ["2.000 operaciones", "5.000 productos", "2 usuarios"],
    color: "text-blue-500"
  },
  avanzado: {
    name: "Plan Avanzado",
    price: 120000,
    features: ["6.000 operaciones", "12.000 productos", "Usuarios ilimitados"],
    color: "text-purple-500"
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const planId = searchParams.get("plan");
  
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS[planId as keyof typeof PLANS];

  useEffect(() => {
    if (!selectedPlan) {
      router.push("/pricing");
    }
  }, [selectedPlan, router]);

  if (!selectedPlan) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Llamada al backend para crear la preferencia de suscripción en Mercado Pago
      const { createSubscription } = await import("../../utils/api");
      const response = await createSubscription(planId as "basic" | "gestion" | "avanzado");
      
      if (response && response.init_point) {
         window.location.href = response.init_point;
      } else {
         throw new Error("No se recibió el link de pago");
      }

    } catch (error) {
      console.error("Payment error", error);
      alert("Hubo un error al iniciar el pago. Por favor intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-muted/20">
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Order Summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resumen de tu pedido</h1>
            <p className="text-muted-foreground mt-2">
              Estás a un paso de potenciar tu negocio con <strong>Controlia</strong>.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{selectedPlan.name}</span>
                <Badge variant="outline" className={selectedPlan.color}>Mensual</Badge>
              </CardTitle>
              <CardDescription>Facturación recurrente cada 30 días.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Precio del plan</span>
                <span className="font-medium">${selectedPlan.price.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Impuestos y tasas</span>
                <span className="font-medium text-green-600">Incluidos</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total a pagar</span>
                <span>${selectedPlan.price.toLocaleString('es-AR')}</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 items-start text-sm text-blue-700 dark:text-blue-300">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p>
              Tu pago está asegurado. Al continuar, aceptas nuestros términos y condiciones de servicio.
              Podrás cancelar tu suscripción en cualquier momento.
            </p>
          </div>
        </div>

        {/* Payment Action */}
        <div className="flex flex-col justify-center space-y-6">
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
              <CardDescription>Selecciona cómo deseas abonar tu suscripción.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md flex items-center justify-between cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors selected border-primary bg-primary/5">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Mercado Pago</p>
                    <p className="text-xs text-muted-foreground">Tarjetas de crédito, débito y dinero en cuenta.</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border border-primary bg-primary" />
              </div>
              
              {/* Placeholder for other methods */}
              {/* <div className="p-4 border rounded-md flex items-center justify-between opacity-50 cursor-not-allowed">
                  ...
              </div> */}

            </CardContent>

            <CardFooter>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(50, 100, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full h-14 relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all"
                onClick={handlePayment}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-100" />
                <span className="absolute inset-[1px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-sm opacity-100 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-md group overflow-hidden">
                    {/* Shine Effect */}
                    <motion.div
                        className="absolute top-0 bottom-0 left-[-100%] w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        initial={{ left: "-100%" }}
                        whileHover={{ left: "200%" }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                    />
                    
                    <span className="relative flex items-center text-white font-bold text-lg tracking-wide">
                        {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Procesando...
                        </>
                        ) : (
                        <>
                            Pagar ${selectedPlan.price.toLocaleString('es-AR')}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                        )}
                    </span>
                </div>
              </motion.button>
            </CardFooter>
          </Card>
          
          <div className="text-center">
             <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => router.back()}>
               Volver a elegir plan
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RoleGuard role="admin">
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutContent />
        </Suspense>
    </RoleGuard>
  );
}
