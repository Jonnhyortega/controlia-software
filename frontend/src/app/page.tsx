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
    if (!loading) {
      if (isAuthenticated) {
        const timeout = setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
        return () => clearTimeout(timeout);
      }
    }
  }, [isAuthenticated, loading, router]);

  // 🔹 Mientras el contexto carga, mostramos el loader
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  // 🔹 Si ya hay sesión, mostramos el loader corto antes del dashboard
  if (isAuthenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  // 🔹 Si no hay sesión → landing
  return <LandingPage />;
}
