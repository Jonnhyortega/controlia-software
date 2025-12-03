import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas (no requieren sesión)
const publicRoutes = ["/login", "/api"];

// Middleware principal
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value || req.headers.get("authorization") || "";

  // Si la ruta es pública, permitir
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir al login
  // if (!token) {
  //   const loginUrl = new URL("/login", req.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

// Rutas donde se aplica el middleware
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
