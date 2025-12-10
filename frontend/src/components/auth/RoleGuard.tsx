"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children, role = "admin" }: { children: React.ReactNode, role?: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== role) {
        // Si no tiene el rol (ej: empleado queriendo entrar a admin), lo mandamos al dashboard
        router.push("/dashboard"); 
      }
    }
  }, [user, loading, role, router]);

  if (loading) return <p className="p-10 text-gray-500">Cargando permisos...</p>;

  // Si no cumple, no renderizar nada (el useEffect redirigirá)
  if (!user || user.role !== role) return null;

  return <>{children}</>;
}
