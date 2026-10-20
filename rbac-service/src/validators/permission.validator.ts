import { z } from "zod";

export const createPermissionSchema = z.object({
  name: z.string().min(2, "Nama permission minimal 2 karakter").max(100),
  code: z
    .string()
    .min(2, "Code permission minimal 2 karakter")
    .max(100)
    .regex(
      /^[a-z0-9:_-]+$/,
      "Code hanya boleh menggunakan huruf kecil, angka, titik dua, underscore, dan tanda hubung",
    ),
  description: z.string().max(255).optional(),
});

export const updatePermissionSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9:_-]+$/)
    .optional(),
  description: z.string().max(255).optional(),
});

export type CreatePermissionInput = z.infer<
  typeof createPermissionSchema
>;

export type UpdatePermissionInput = z.infer<
  typeof updatePermissionSchema
>;