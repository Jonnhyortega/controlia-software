import { z } from "zod";

export const AuthResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
  token: z.string(),
  membershipTier: z.enum(["basic", "medium", "pro"]).optional(),
  active: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  logoUrl: z.string().optional(),
  membershipStartDate: z.string().optional(),
  createdAt: z.string().optional(),
  trialDaysRemaining: z.union([z.string(), z.number()]).optional(),
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
});

export default {
  AuthResponseSchema,
  CreateSaleResponseSchema,
  DailyCashSchema,
};
