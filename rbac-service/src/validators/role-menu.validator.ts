import { z } from "zod";

export const updateRoleMenusSchema = z.object({
  menuIds: z
    .array(z.number().int().positive())
    .max(100),
});

export type UpdateRoleMenusInput = z.infer<
  typeof updateRoleMenusSchema
>;