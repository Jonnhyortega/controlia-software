import { z } from "zod";

export const AuthResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  businessName: z.string().nullable().optional(),
  email: z.string().email(),
  role: z.string().nullable().optional(),
  token: z.string(),
  membershipTier: z.enum(["basic", "medium", "pro"]).nullable().optional(),
  active: z.boolean().nullable().optional(),
  isEmailVerified: z.boolean().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  membershipStartDate: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  trialDaysRemaining: z.union([z.string(), z.number()]).nullable().optional(),
  address: z.string().nullable().optional(),
});

export const SaleProductSchema = z.object({
  product: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  price: z.number(),
});

export const SaleSchema = z.object({
  _id: z.string(),
  user: z.any(),
  products: z.array(SaleProductSchema),
  total: z.number(),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
});

export const CreateSaleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  sale: SaleSchema.optional(),
  dailyCash: z.any().optional(),
});

export const DailyCashSchema = z.object({
  _id: z.string(),
  user: z.any(),
  date: z.string(),
  sales: z.array(z.any()),
  totalSalesAmount: z.number(),
  totalOperations: z.number(),
  extraExpenses: z.array(z.object({ description: z.string().optional(), amount: z.number() })).optional(),
  supplierPayments: z.array(z.object({ metodo: z.string().optional(), total: z.number() })).optional(),
  totalOut: z.number().optional(),
  finalExpected: z.number().optional(),
  finalReal: z.number().optional(),
  difference: z.number().optional(),
  status: z.string().optional(),
  closedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export default {
  AuthResponseSchema,
  CreateSaleResponseSchema,
  DailyCashSchema,
};
