import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh berisi huruf, angka, dan underscore",
    ),

  email: z
    .string()
    .email("Format email tidak valid")
    .max(255),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100),

  fullName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(150),

  roleId: z
    .number()
    .int()
    .positive(),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),

  email: z
    .string()
    .email()
    .max(255)
    .optional(),

  fullName: z
    .string()
    .min(2)
    .max(150)
    .optional(),

  roleId: z
    .number()
    .int()
    .positive()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;