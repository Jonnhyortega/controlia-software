"use client";

import { useEffect, useState } from "react";
import { getProfile } from "../../../utils/api";

import { useAuth } from "../../../context/authContext"; // Adjust path if needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

import RoleGuard from "@/components/auth/RoleGuard";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<string | number>(user?.trialDaysRemaining || 0);
  const [status, setStatus] = useState<string | null | undefined>(user?.subscriptionStatus);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch fresh profile data on mount (like Navbar)
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        if (data.trialDaysRemaining !== undefined) {
          setTrialDaysRemaining(data.trialDaysRemaining);
        }
        if (data.subscriptionStatus) {
            setStatus(data.subscriptionStatus);
        }
      } catch (error) {
        console.error("Error fetching profile in subscription page", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const daysRemaining = typeof trialDaysRemaining === 'string' 
    ? parseInt(trialDaysRemaining, 10) 
    : (trialDaysRemaining || 0);
  
  const isAuthorized = status === 'authorized';
  const isValid = daysRemaining > 0 || isAuthorized;

  const totalTrialDays = 90;
  const progress = ((totalTrialDays - daysRemaining) / totalTrialDays) * 100;

  // Helper logic for Plan Display
  const getPlanName = (tier?: string) => {
    switch(tier) {
      case 'gestion': return 'Plan Gestión';
      case 'avanzado': return 'Plan Avanzado';
      case 'basic': return 'Plan Base';
      default: return 'Plan Base';
    }
  };

  let planLabel = getPlanName(user?.membershipTier);
  let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
  let statusParams = { label: "", description: "" };

  if (status === 'authorized') {
    statusParams = { label: "", description: "Tienes una suscripción activa. ¡Gracias por confiar en Controlia!" };
    badgeVariant = "default";
  } else if (status === 'pending') {
    statusParams = { label: " (Pendiente)", description: "Estamos procesando tu pago. Por favor espera unos momentos." };
    badgeVariant = "secondary";
  } else if (status === 'paused') {
     statusParams = { label: " (Pausada)", description: "Tu suscripción está en pausa." };
     badgeVariant = "secondary";
  } else if (status === 'cancelled') {
     statusParams = { label: " (Cancelada)", description: "Tu suscripción ha sido cancelada." };
     badgeVariant = "destructive";
  } else {
    // No subscription status -> Check Trial
    if (isValid) {
        statusParams = { label: " (Prueba)", description: "Disfruta de todas las funciones premium durante el periodo de prueba." };
        badgeVariant = "default"; // or secondary/green
    } else {
        statusParams = { label: " (Finalizado)", description: "Tu periodo de prueba ha finalizado." };
        badgeVariant = "destructive";
    }
  }


  return (
    <RoleGuard role="admin">
    <div className="p-6 space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Mi Suscripción</h1>
          <p className="text-muted-foreground text-lg">Gestiona tu plan y facturación de manera sencilla.</p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {/* Current Plan Card */}
        <Card className="w-full shadow-lg border-muted/60">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Plan Actual</span>
              <Badge variant={badgeVariant}>
                {planLabel}{statusParams.label}
              </Badge>
            </CardTitle>
            <CardDescription>
              {statusParams.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                {isAuthorized ? (
                  <>
                    <span className="text-muted-foreground">Próxima renovación</span>
                    <span className="font-medium">
                        {user?.membershipEndDate 
                            ? new Date(user.membershipEndDate).toLocaleDateString() 
                            : "Suscripción indefinida"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground">Días restantes de prueba</span>
                    <span className="font-medium">{daysRemaining} días</span>
                  </>
                )}
              </div>

              {!isAuthorized && (
                <>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                        Finaliza el {new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                </>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-md space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Acceso completo al sistema</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Sin límites de productos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Soporte prioritario</span>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/pricing">
                <Sparkles className="w-4 h-4 mr-2" />
                Mejorar mi Plan
              </Link>
            </Button>
          </CardContent>
        </Card>

{/* Payment Method section removed as per request */}
      </div>
    </div>
    </RoleGuard>
  );
}
