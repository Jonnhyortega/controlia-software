import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas (no requieren sesión)
const publicRoutes = ["/login", "/api"];

// Middleware principal
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Ignorar archivos estáticos y de sistema (por seguridad extra si el matcher falla)
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  
  const isAuthRoute = ["/login", "/register", "/verify-email"].some(r => pathname.startsWith(r));
  const isPublicRoute = ["/", "/landing", "/pricing"].includes(pathname) || isAuthRoute;

  // 1. Si intenta entrar a ruta protegida sin token -> Login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    // Guardar la url a la que intentaba ir para redirigir después ?
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si tiene token y quiere ir a Login/Registro -> Dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Rutas donde se aplica el middleware
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
