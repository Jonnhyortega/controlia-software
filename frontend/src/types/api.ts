// Tipos compartidos para llamadas a la API — frontend

export interface UserAPI {
  _id: string;
  name: string;
  email: string;
  role?: string;
  membershipTier?: "basic" | "medium" | "pro";
  active?: boolean;
  isEmailVerified?: boolean;
  logoUrl?: string;
  membershipStartDate?: string;
  trialDaysRemaining?: string | number;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role?: string;
  membershipTier?: "basic" | "medium" | "pro";
  active?: boolean;
  isEmailVerified?: boolean;
  logoUrl?: string;
  membershipStartDate?: string;
  trialDaysRemaining?: string | number;
  token: string;
}

export interface Product {
  _id: string;
  name: string;
  category?: string;
  price: number;
  cost?: number;
  stock?: number;
  barcode?: string | null;
  description?: string;
  supplier?: { _id: string; name?: string } | string | null;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaleProduct {
  product?: string | null; // producto id o null (venta manual)
  name?: string | null;
  quantity: number;
  price: number;
}

export interface Sale {
  _id: string;
  user?: string | UserAPI;
  products: SaleProduct[];
  total: number;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
}

export interface DailyCash {
  _id: string;
  user?: string | UserAPI;
  date: string;
  sales: (string | Sale)[];
  totalSalesAmount: number;
  totalOperations: number;
  extraExpenses?: { description?: string; amount: number }[];
  supplierPayments?: { metodo?: string; total: number }[];
  totalOut?: number;
  finalExpected?: number;
  finalReal?: number;
  difference?: number;
  status?: string;
  createdAt?: string;
  closedAt?: string;
}

export interface ApiResult<T = any> {
  success: boolean;
  status?: number;
  message?: string;
  data?: T | null;
}

export type Employee = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  disabled?: boolean;
};

export interface Supplier {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}
