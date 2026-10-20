import { z } from "zod";

export const updateRolePermissionsSchema = z.object({
  permissionIds: z
    .array(z.number().int().positive())
    .max(100),
});

export type UpdateRolePermissionsInput = z.infer<
  typeof updateRolePermissionsSchema
>;