import { z } from "zod";

export const createMenuSchema = z.object({
  parentId: z.number().int().positive().optional(),
  name: z.string().min(2).max(100),
  code: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9:_-]+$/,
      "Code hanya boleh menggunakan huruf kecil, angka, titik dua, underscore, dan tanda hubung",
    ),
  path: z.string().max(255).optional(),
  icon: z.string().max(100).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateMenuSchema = z.object({
  parentId: z.number().int().positive().nullable().optional(),
  name: z.string().min(2).max(100).optional(),
  code: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9:_-]+$/)
    .optional(),
  path: z.string().max(255).optional(),
  icon: z.string().max(100).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;