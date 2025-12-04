"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import Loading from "../components/loading";
import LandingPage from "./landing/page";

export default function HomePage() {
  const router = useRouter();
  const { token, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  // Mostrar loader si está cargando O si está autenticado (mientras redirige)
  if (loading || isAuthenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  // Si no carga y no está autenticado -> Landing
  return <LandingPage />;
}