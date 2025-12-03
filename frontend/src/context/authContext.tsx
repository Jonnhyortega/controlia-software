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
  email: string;
  role?: string;
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
  }>;
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
    const storedToken = Cookies.get("token") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (err) {
        console.warn("⚠️ Error al parsear usuario guardado:", err);
        // Si el JSON está corrupto, limpiamos todo
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Cookies.remove("token");
        setUser(null);
        setToken(null);
      }
    }
  
    setLoading(false);
  }, []);
  

  // ==========================================================
  // 🔹 Login
  // ==========================================================
 
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string; user?: User }> => {
    try {
      const res = await api.post("/users/login", { email, password });
  
      // 💡 Tu backend devuelve directamente los campos del user + token
      // valida la respuesta runtime contra el esquema
      const parsed = AuthResponseSchema.safeParse(res.data);
      if (!parsed.success) {
        console.error("Auth response inválida:", parsed.error.issues);
        throw new Error("Respuesta inválida del servidor");
      }

      const { token, _id, name, email: userEmail, role } = parsed.data;
  
      const user = { _id, name, email: userEmail, role };
  
      // 💾 Guardamos todo en cookies y localStorage
      Cookies.set("token", token, { expires: 7 });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      setToken(token);
      setUser(user);
  
      return { success: true, user };
    } catch (err: any) {
      console.error("❌ Error de login:", err.response?.data || err);
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          "Error al iniciar sesión. Intenta otra vez.",
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
        logout,
        setUser,
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
