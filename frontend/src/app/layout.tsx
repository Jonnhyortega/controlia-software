import "./globals.css";
import { ToastProvider } from "../context/ToastContext";
import { AuthProvider } from "../context/authContext";
import { CustomizationProvider } from "../context/CustomizationContext";
import { Inter, Inter_Tight, Funnel_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
});

export const metadata = {
  title: "Controlia",
  description: "Sistema de gestión comercial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.className} ${interTight.className} ${funnelDisplay.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <CustomizationProvider>
              {children}
            </CustomizationProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
