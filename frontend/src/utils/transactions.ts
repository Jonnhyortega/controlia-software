import { api } from "./api";
import { Transaction } from "../types/api";

// Obtener transacciones (filtrado por cliente o proveedor)
export const getTransactions = async (params: { clientId?: string; supplierId?: string }): Promise<Transaction[]> => {
  const query = new URLSearchParams();
  if (params.clientId) query.append("clientId", params.clientId);
  if (params.supplierId) query.append("supplierId", params.supplierId);
  
  const res = await api.get(`/transactions?${query.toString()}`);
  return res.data;
};

// Crear transacción
export const createTransaction = async (formData: FormData): Promise<Transaction> => {
  const res = await api.post("/transactions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Actualizar transacción
export const updateTransaction = async (id: string, formData: FormData): Promise<Transaction> => {
  const res = await api.put(`/transactions/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Eliminar transacción
export const deleteTransaction = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};
