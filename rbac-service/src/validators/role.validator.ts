import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Nama role minimal 2 karakter")
    .max(100),

  code: z
    .string()
    .min(2, "Code role minimal 2 karakter")
    .max(50)
    .regex(
      /^[A-Z0-9_]+$/,
      "Code hanya boleh menggunakan huruf kapital, angka, dan underscore",
    ),

  description: z
    .string()
    .max(255)
    .optional(),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  code: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Z0-9_]+$/)
    .optional(),

  description: z
    .string()
    .max(255)
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type CreateRoleInput = z.infer<
  typeof createRoleSchema
>;

export type UpdateRoleInput = z.infer<
  typeof updateRoleSchema
>;