"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import Cookies from "js-cookie";
import { api } from "../utils/api";
import { AuthResponseSchema } from "../validators/apiValidators";

// ==========================================================
// 🔹 Tipos
// ==========================================================
interface User {
  _id: string;
  name: string;
  businessName: string;
  email: string;
  role?: string;
  membershipTier?: "basic" | "medium" | "pro";
  active?: boolean;
  isEmailVerified?: boolean;
  logoUrl?: string;
  address?: string;
  membershipStartDate?: string;
  trialDaysRemaining?: string | number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message?: string;
    user?: User;
    emailNotVerified?: boolean;
    email?: string;
  }>;
  register: (
    data: { name: string; lastName?: string; businessName: string; email: string; password: string }
  ) => Promise<{ success: boolean; message?: string; email?: string }>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// ==========================================================
// 🔹 Crear contexto con tipo inicial null
// ==========================================================
const AuthContext = createContext<AuthContextType | null>(null);

// ==========================================================
// 🔹 Proveedor del contexto
// ==========================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ==========================================================
  // 🔹 Cargar sesión guardada desde cookies/localStorage
  // ==========================================================
  useEffect(() => {
    const fn = async () => {
      const storedToken = Cookies.get("token") || localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
    
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        
        // 1. Restaurar usuario almacenado temporalmente (para evitar flash de "no logueado")
        if (storedUser) {
           try {
             setUser(JSON.parse(storedUser));
           } catch {}
        }

        // 2. Obtener datos frescos del backend (incluyendo logo y businessName actualizado)
        try {
          const { getProfile } = await import("../utils/api"); // Import dinámico para evitar ciclo
          const freshUser = await getProfile();
          
          setUser(freshUser as any); 
          localStorage.setItem("user", JSON.stringify(freshUser));
        } catch (err) {
          console.warn("⚠️ No se pudo refrescar perfil:", err);
          // Si falla (ej: token vencido), podríamos desloguear, pero dejemos que el interceptor de axios lo maneje si es 401.
          
          // Si no había usuario guardado y falló el fetch, limpiamos todo
          if (!storedUser) {
             Cookies.remove("token");
             localStorage.removeItem("token");
             setToken(null);
          }
        }
      }
      setLoading(false);
    };

    fn();
  }, []);

  // ==========================================================
  // 🔹 Check Trial Status
  // ==========================================================
  // ==========================================================
  // 🔹 Check Trial Status (ELIMINADO - Usamos backend)
  // ==========================================================
  // La lógica ahora reside en el backend. Usamos user.trialDaysRemaining.


  // ==========================================================
  // 🔹 Login
  // ==========================================================
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string; user?: User; emailNotVerified?: boolean; email?: string }> => {
    try {
      const res = await api.post("/users/login", { email, password });
      
      const parsed = AuthResponseSchema.safeParse(res.data);
      if (!parsed.success) {
        console.error("Auth response inválida:", parsed.error.issues);
        // Si falla validación de schema, imprimimos pero intentamos seguir si hay token?
        // Mejor lanzar error para seguridad
        throw new Error("Respuesta inválida del servidor");
      }

      const { token, _id, name, businessName, email: userEmail, role, membershipTier, active, isEmailVerified, logoUrl, address, membershipStartDate, createdAt, trialDaysRemaining } = parsed.data;
  
      const user: User = { 
        _id, 
        name, 
        businessName: businessName || name, // Fallback temporal
        email: userEmail, 
        role: role || undefined,
        membershipTier: membershipTier as "basic" | "medium" | "pro",
        active: active ?? undefined, // boolean
        isEmailVerified: isEmailVerified ?? undefined, // boolean
        logoUrl: logoUrl || undefined,
        address: address || undefined,
        membershipStartDate: (membershipStartDate || createdAt) || undefined,
        trialDaysRemaining: trialDaysRemaining ?? undefined
      };
  
      // 💾 Guardamos todo en cookies y localStorage
      Cookies.set("token", token, { expires: 7 });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      setToken(token);
      setUser(user);
  
      return { success: true, user };
    } catch (err: any) {
      const isUnverifiedError = err?.response?.status === 403 && err?.response?.data?.emailNotVerified;

      // Solo loguear error si NO es un error de verificación de email (que es esperado)
      if (!isUnverifiedError) {
        console.error("❌ Error de login:", err.response?.data || err);
      }
      
      // ✉️ Detectar si el email no está verificado
      if (err?.response?.status === 403 && err?.response?.data?.emailNotVerified) {
        return {
          success: false,
          emailNotVerified: true,
          email: email,
          message: err?.response?.data?.message || "Email no verificado",
        };
      }
      
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          "Error al iniciar sesión. Intenta otra vez.",
      };
    }
  };

  // ==========================================================
  // 🔹 Registro
  // ==========================================================
  const register = async (
    data: { name: string; lastName?: string; businessName: string; email: string; password: string }
  ): Promise<{ success: boolean; message?: string; email?: string }> => {
    try {
      const res = await api.post("/users/register", data);

      return {
        success: true,
        message: res.data.message || "Cuenta creada correctamente.",
        email: data.email, // Retornar email para redirección
      };
    } catch (err: any) {
      console.error("❌ Error en registro:", err.response?.data || err);
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          "Error al crear la cuenta. Intenta nuevamente.",
      };
    }
  };

  // ==========================================================
  // 🔹 Logout
  // ==========================================================
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  // ==========================================================
  // 🔹 Autenticación
  // ==========================================================
  const isAuthenticated = !!token && !!user;

  return (
  <AuthContext.Provider
    value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,  
      logout,
      setUser
    }}
  >
    {children}
  </AuthContext.Provider>
  );
}

// ==========================================================
// 🔹 Hook personalizado
// ==========================================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return context;
}
