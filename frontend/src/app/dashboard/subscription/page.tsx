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
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch fresh profile data on mount (like Navbar)
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        if (data.trialDaysRemaining !== undefined) {
          setTrialDaysRemaining(data.trialDaysRemaining);
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
  
  const isValid = daysRemaining > 0;

  const totalTrialDays = 90;
  const progress = ((totalTrialDays - daysRemaining) / totalTrialDays) * 100;

  return (
    <RoleGuard role="admin">
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Suscripción</h1>
          <p className="text-muted-foreground">Gestiona tu plan y facturación.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Plan Actual</span>
              <Badge variant={isValid ? "default" : "destructive"}>
                {user?.membershipTier === 'basic' ? 'Plan Base (Prueba)' : 
                 user?.membershipTier === 'gestion' ? 'Plan Gestión' :
                 user?.membershipTier === 'avanzado' ? 'Plan Avanzado' : 'Plan Base'}
              </Badge>
            </CardTitle>
            <CardDescription>
              {isValid 
                ? "Disfruta de todas las funciones premium durante el periodo de prueba." 
                : "Tu periodo de prueba ha finalizado."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Días restantes</span>
                <span className="font-medium">{daysRemaining} días</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                Finaliza el {new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
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

        {/* Payment Method Placeholder */}
        <Card className="md:col-span-1 border-dashed">
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
            <CardDescription>
              No se requiere tarjeta de crédito para el periodo de prueba.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px] text-center space-y-4">
            <div className="p-3 bg-muted rounded-full">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Sin método de pago</p>
              <p className="text-sm text-muted-foreground">Agrega uno para continuar después de la prueba.</p>
            </div>
            <Button variant="outline" disabled>Agregar Método de Pago</Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </RoleGuard>
  );
}
