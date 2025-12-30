"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Check, X, ArrowLeft, Star, ShoppingCart, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import RoleGuard from "@/components/auth/RoleGuard";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  highlight?: string;
  quote?: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: "Base",
    price: "$25.000",
    description: "Para comercios chicos que quieren ordenarse.",
    features: [
      "300 operaciones mensuales",
      "100 productos",
      "1 usuario",
      "5 proveedores"
    ],
    color: "text-green-500",
  },
  {
    id: 'gestion',
    name: "Gestión",
    price: "$59.000",
    description: "Para negocios en crecimiento.",
    features: [
      "2.000 operaciones mensuales",
      "5.000 productos",
      "2 usuarios",
      "25 proveedores"
    ],
    color: "text-blue-500",
  },

];

function PricingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isExpiredQuery = searchParams.get("expired") === "true";

  // Determine if check for trial. 
  // Assuming if trialDaysRemaining is huge or matches logic, it's trial.
  // Or simply rely on "basic" membership + positive trial days.
  const isTrial = (user?.trialDaysRemaining && Number(user.trialDaysRemaining) > 0) || false;
  
  // Also check if user status explicitly says cancelled or paused (or we rely on the query param for now)
  const isExpired = isExpiredQuery || user?.subscriptionStatus === "cancelled" || user?.subscriptionStatus === "paused";

  // If in trial, show all. If subscribed to a paid plan, hide current plan.
  // Note: user.membershipTier defaults to 'basic' often. 
  // We need to differentiate Paid Basic from Trial Basic if possible.
  // For now, if isTrial is true, we show all (including Basic so they can pay for it).
  // If !isTrial, we filter out the current plan.
  
  const currentPlanId = user?.membershipTier || 'basic';

  const visiblePlans = plans.filter(plan => {
    // Si está en trial o vencido, mostramos TODOS los planes (incluyendo basic para que pueda pagarlo)
    if (isTrial || isExpired) return true;
    return plan.id !== currentPlanId;
  });

  const handleSubscribe = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <RoleGuard role="admin">
      <div className="min-h-screen w-full bg-background relative overflow-hidden flex flex-col items-center py-10 px-4 md:px-8">
        
        {/* Ambient Background Effects */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10 w-full max-w-7xl space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Planes Flexibles para tu Negocio
            </h1>
            <p className="text-xl text-muted-foreground">
              Elige la herramienta perfecta para escalar tus operaciones.
              <br />
              <span className="text-sm font-medium text-primary">Precios finales - Sin costos ocultos.</span>
            </p>
          </div>

          {/* Pricing Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {visiblePlans.map((plan) => (
              <motion.div key={plan.id} variants={itemVariants} className="flex">
                <Card 
                  className={`relative flex flex-col w-full h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-muted ${
                    plan.popular ? 'border-primary/50 shadow-lg shadow-primary/10' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-1 flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        Más Elegido
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="space-y-1">
                      <CardTitle className={`text-2xl font-bold flex items-center gap-2  font-funnel-display drop-shadow-lg ${plan.color}`}>
                        {plan.id === 'basic' && "🟢"}
                        {plan.id === 'gestion' && "🔵"}
                        {plan.id === 'avanzado' && "🟣"}
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-base h-10 flex items-center">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-6">
                    <div className="flex items-baseline text-foreground">
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">/mes</span>
                    </div>

                    {plan.quote && (
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <p className="text-sm italic text-primary/80 text-center font-medium">
                          {plan.quote}
                        </p>
                      </div>
                    )}

                    <ul className="space-y-3 pt-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <div className={`mt-0.5 rounded-full p-1 ${
                            plan.popular ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button 
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full h-12 text-base font-semibold shadow-sm transition-all ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25' 
                          : ''
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                      Elegir Plan {plan.name}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Actions */}
          <div className="flex justify-center mt-12">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Cancelar y volver al Dashboard
            </Button>
          </div>

          <div className="flex justify-center items-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Pagos Seguros
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Cancelación en cualquier momento
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PricingContent />
    </Suspense>
  );
}
