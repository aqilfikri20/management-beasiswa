import {
  createPermission,
  deletePermission,
  findAllPermissions,
  findPermissionByCode,
  findPermissionById,
  updatePermission,
} from "../repositories/permission.repository.js";

import type {
  CreatePermissionInput,
  UpdatePermissionInput,
} from "../validators/permission.validator.js";

export const getPermissions = async () => {
  return findAllPermissions();
};

export const getPermissionById = async (id: number) => {
  const permission = await findPermissionById(id);

  if (!permission) {
    throw new Error("Permission tidak ditemukan");
  }

  return permission;
};

export const createNewPermission = async (
  input: CreatePermissionInput,
) => {
  const existingPermission = await findPermissionByCode(input.code);

  if (existingPermission) {
    throw new Error("Permission code sudah digunakan");
  }

  return createPermission({
    name: input.name,
    code: input.code,
    ...(input.description !== undefined && {
      description: input.description,
    }),
  });
};

export const updateExistingPermission = async (
  id: number,
  input: UpdatePermissionInput,
) => {
  const existingPermission = await findPermissionById(id);

  if (!existingPermission) {
    throw new Error("Permission tidak ditemukan");
  }

  if (input.code) {
    const permissionWithSameCode =
      await findPermissionByCode(input.code);

    if (
      permissionWithSameCode &&
      permissionWithSameCode.id !== id
    ) {
      throw new Error("Permission code sudah digunakan");
    }
  }

  const updateData = Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined,
    ),
  );

  return updatePermission(id, updateData);
};

export const deleteExistingPermission = async (id: number) => {
  const permission = await findPermissionById(id);

  if (!permission) {
    throw new Error("Permission tidak ditemukan");
  }

  if (permission.rolePermissions.length > 0) {
    throw new Error(
      "Permission masih digunakan oleh role",
    );
  }

  await deletePermission(id);
};