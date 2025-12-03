import axios from "axios";
import Cookies from "js-cookie";
// NOTE: avoid importing next/router here (can break on SSR).
// Use a safe window redirect when running client-side instead.
import type {
  ApiResult,
  DailyCash,
  Product,
  Sale,
  SaleProduct,
  AuthResponse,
  Supplier,
  Employee,
  UserAPI,
} from "../types/api";
import { CreateSaleResponseSchema, DailyCashSchema } from "../validators/apiValidators";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Headers comunes
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ✅ Instancia principal de Axios
export const api = axios.create({
  baseURL: API_URL,
});

// ✅ Interceptor de request — agrega token en cada petición automáticamente
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de respuesta — captura expiración o 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        // Do not force redirect for auth endpoints (login/register/google) — these should be handled by the caller
        const reqUrl = error.config?.url || "";
        const isAuthEndpoint = /\/users\/(login|register|google)/.test(reqUrl);
        if (isAuthEndpoint) return Promise.reject(error);
      console.warn("⚠️ Sesión expirada o token inválido. Cerrando sesión...");
      Cookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirigir en cliente de forma segura (no usar next/router en módulos compartidos)
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/auth")) {
          // usamos replace para evitar que el historial vuelva a la página protegida
          // Use the app's login page instead of /auth which may not exist
          window.location.replace("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);


// 🧭 Obtener datos del dashboard principal
export async function getDashboardData(): Promise<{
  totalSales: number;
  totalOperations: number;
  sales: any[];
  totalProducts: number;
  totalClients: number;
  date: string;
}> {
  try {
    const [latestDaily, products, clients] = await Promise.allSettled([
      api.get("/daily-sales/latest"),
      api.get("/products"),
      api.get("/clients"),
    ]);

    // 🧾 Manejar resultado seguro
    const dailyData =
      latestDaily.status === "fulfilled" && latestDaily.value.data
        ? latestDaily.value.data
        : null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);


    return {
      totalSales: dailyData?.totalSalesAmount || 0,
      totalOperations: dailyData?.totalOperations || 0,
      sales: dailyData?.sales || [],
      totalProducts:
        products.status === "fulfilled" ? products.value.data.length : 0,
      totalClients:
        clients.status === "fulfilled" ? clients.value.data.length : 0,
      date: dailyData?.date || today.toISOString(),
    };
  } catch (error: any) {
    console.error("❌ Error al obtener datos del dashboard:", error);
    return {
      totalSales: 0,
      totalOperations: 0,
      sales: [],
      totalProducts: 0,
      totalClients: 0,
      date: new Date().toISOString(),
    };
  }
}

// 📊 Obtener caja del día (equivale a daily sales)
export const getTodayDailySales = async (): Promise<DailyCash | null> => {
  const res = await api.get("/daily-cash/today");
  const parsed = DailyCashSchema.safeParse(res.data);
  // If the response doesn't match our schema, don't attempt to coerce it into DailyCash — return null
  return parsed.success ? parsed.data : null;
};


// 🧾 Obtener caja diaria (por fecha específica)
export const getDailyCashByDate = async (date: string): Promise<DailyCash> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/daily-cash/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  console.log(data.status)
  if (!res.ok) {
    const msg = data?.message || "Error al obtener caja por fecha";
    throw new Error(msg);
  }

  const parsed = DailyCashSchema.safeParse(data);
  if (!parsed.success) {
    // si no cumple el esquema, devolvemos la respuesta sin parsear y dejamos que componentes manejen errores
    console.warn("getDailyCashByDate: respuesta no cumple esquema", parsed.error.issues);
    return data;
  }

  return parsed.data;
};



// 🧾 Cerrar caja del día
export async function closeDailyCash(data: {
  extraExpenses: { description: string; amount: number }[];
  supplierPayments: { metodo: string; total: number }[];
  finalReal?: number;
}): Promise<ApiResult<DailyCash | null>> {
  try {
    const res = await api.post("/daily-cash/close", data);

    return {
      success: true, // 👈 clave para que el overlay sea verde
      status: res.status,
      message: res.data?.message || "Caja cerrada correctamente.",
      data: res.data || null,
    };
  } catch (error: any) {
    console.error("❌ Error al cerrar caja:", error);

    const message =
      error?.response?.data?.message ||
      (typeof error?.response?.data === "string"
        ? error.response.data
        : null) ||
      error?.message ||
      "Error desconocido al cerrar caja.";

    return {
      success: false,
      status: error?.response?.status || 500,
      message,
      data: null,
    };
  }
}

// 🧾 Cerrar caja por ID
export async function closeDailyCashById(
  id: string,
  data: {
    extraExpenses: { description: string; amount: number }[];
    supplierPayments: { metodo: string; total: number }[];
    finalReal?: number;
  }
): Promise<ApiResult<DailyCash | null>> {
  try {
    const res = await api.post(`/daily-cash/${id}/close`, data);

    return {
      success: true,
      status: res.status,
      message: res.data?.message || "Caja cerrada correctamente.",
      data: res.data?.data || res.data || null,
    };
  } catch (error: any) {
    console.error("❌ Error al cerrar caja por ID:", error);

    const message =
      error?.response?.data?.message ||
      (typeof error?.response?.data === "string"
        ? error.response.data
        : null) ||
      error?.message ||
      "Error desconocido al cerrar caja.";

    return {
      success: false,
      status: error?.response?.status || 500,
      message,
      data: null,
    };
  }
}


// CREAR VENTA
export const createSale = async (
  data: { products: SaleProduct[]; total: number; paymentMethod?: string }
): Promise<{ success: boolean; message?: string; sale?: Sale; dailyCash?: DailyCash }> => {
  const res = await axios.post(`${API_URL}/sales`, data, {
    withCredentials: true,
  });
  // Validar runtime la respuesta crítica
  try {
    const parsed = CreateSaleResponseSchema.safeParse(res.data);
    if (!parsed.success) {
      console.warn("Respuesta createSale inválida:", parsed.error.issues);
      return res.data as any;
    }
    // safe cast to declared return shape — the validator may relax some nested fields (eg. user)
    return parsed.data as { success: boolean; message?: string; sale?: Sale; dailyCash?: DailyCash };
  } catch (e) {
    return res.data;
  }
};

// LISTAR VENTAS DE CAJAS
export const getClosedCashDays = async (): Promise<DailyCash[]> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/daily-cash/days`, {
    
    headers: {
      Authorization: `Bearer ${token}`,
    },  
  });

  if (!res.ok) throw new Error("Error al obtener días con cierres de caja");
  return res.json();
};


// ✅ src/utils/api.ts
export const updateDailyCash = async (id: string, updates: Partial<DailyCash>): Promise<DailyCash> => {
  const res = await api.put(`${API_URL}/daily-cash/${id}`, updates);
  return res.data;
};


/* ==========================================================
   📦 PRODUCTOS - CRUD COMPLETO
========================================================== */

// 🟢 Obtener todos los productos del usuario
export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data;
};

// 🟢 Crear un nuevo producto
export const createProduct = async (data: {
  name: string;
  category?: string;
  price: number;
  cost?: number;
  stock?: number;
  barcode?: string;
  description?: string;
  supplier?:string;
}): Promise<Product> => {
  const res = await api.post("/products", data);
  return res.data;
};

// 🟢 Obtener un producto por ID
export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  const cleanData = { ...data };
  if (!cleanData.supplier) delete cleanData.supplier;
  const res = await api.put(`/products/${id}`, cleanData);
  return res.data;
};

// 🔴 Eliminar un producto
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};


// Crud para proveedores
export const getSuppliers = async (): Promise<Supplier[]> => {
  const res = await api.get("/suppliers");
  return res.data;
};

// Crear proveedor
export const createSupplier = async (data: Partial<Supplier>): Promise<Supplier> => {
  const res = await api.post("/suppliers", data);
  return res.data;
};

// Actualiar proveedor
export const updateSupplier = async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
  const res = await api.put(`/suppliers/${id}`, data);
  return res.data;
};

// Borrar proveedor
export const deleteSupplier = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};


function getLocalMidnightUTC() {
  throw new Error("Function not implemented.");
}

// EMPLOYEES
// Listar empleados
export async function getEmployees(): Promise<Employee[]> {
  const res = await api.get("/admin/employees");
  return res.data;
}

// Crear empleado
export async function createEmployee(data: Partial<Employee>): Promise<Employee> {
  const res = await api.post("/admin/employees", data);
  return res.data;
}

// Actualizar empleado
export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  const res = await api.put(`/admin/employees/${id}`, data);
  return res.data;
}

// Desactivar empleado
export async function disableEmployee(id: string): Promise<{ message: string }> {
  const res = await api.patch(`/admin/employees/${id}/disable`);
  return res.data;
}

// Modificar contraseña de empleado
export const resetEmployeePassword = async (id: string, newPassword: string): Promise<ApiResult<null>> => {
  const res = await api.patch(`/admin/employees/${id}/password`, {
    newPassword,
  });
  return res.data;
};

// BORRAR EMPLEADO
export const deleteEmployee = async (id: string): Promise<ApiResult<null>> => {
  try {
    const res = await api.delete(`/admin/employees/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error eliminando empleado:", error);
    throw new Error(error?.response?.data?.message || "Error al eliminar empleado");
  }
};

// ACTIVAR EMPLEADO
export const enableEmployee = async (id: string): Promise<ApiResult<Employee>> => {
  const res = await api.patch(`/admin/employees/${id}/enable`);
  return res.data;
};


// ===========================
//   PERFIL DEL USUARIO
// ===========================


// Obtener token del localStorage (client-side)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};


// ===============================
//  📌 Obtener perfil actual
// ===============================
export const getProfile = async (): Promise<UserAPI> => {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: authHeaders(),
  });

  // console.log(res);
  if (!res.ok) throw new Error("No se pudo cargar el perfil");

  return await res.json();
};

// ===============================
//  📌 Actualizar perfil (admin/empleado)
// ===============================
export const updateProfile = async (data: Partial<UserAPI>) : Promise<{ message: string; user?: Partial<UserAPI> }>=> {
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al actualizar perfil");
  }

  return await res.json();
};

// ===============================
//  📌 Cambiar contraseña propia
// ===============================
export const changeMyPassword = async (data: { oldPassword: string; newPassword: string }): Promise<{ message: string } | { error?: string } > => {
  const res = await fetch(`${API_URL}/users/profile/password`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "No se pudo cambiar la contraseña");
  }

  return await res.json();
};


// OBTENER CUSTOMIZATION DEL USUARIO
export const getCustomization = async () => {
  const res = await api.get("/customization");
  // console.log(res.data)
  return res.data;
};

// PUT CUSTOMIZATION
export const updateCustomization = async (payload: any) => {
  const res = await api.put("/customization", payload);
  return res.data;
};

// SUBIR LOGO
export async function uploadLogo(file: File) {
  const formData = new FormData();
  formData.append("logo", file);

  const res = await fetch(`${API_URL}/customization/logo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al subir el logo");
  }

  return res.json();
}


// RESET
export const resetCustomization = async () => {
  const res = await api.post("/customization/reset");
  return res.data;
};
