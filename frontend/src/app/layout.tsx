import "./globals.css";
import { ToastProvider } from "../context/ToastContext";
import { AuthProvider } from "../context/authContext";
import { Inter, Inter_Tight } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});


export const metadata = {
  title: "Controlia",
  description: "Sistema de gestión comercial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Use className (stable) instead of font "variable" to avoid SSR/CSR mismatch
    <html lang="es" className={`${inter.className} ${interTight.className}`}>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
