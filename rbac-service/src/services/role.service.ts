import {
  createRole,
  deleteRole,
  findAllRoles,
  findRoleByCode,
  findRoleById,
  updateRole,
} from "../repositories/role.repository.js";

import type {
  CreateRoleInput,
  UpdateRoleInput,
} from "../validators/role.validator.js";

export const getRoles = async () => {
  return findAllRoles();
};

export const getRoleById = async (id: number) => {
  const role = await findRoleById(id);

  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  return role;
};

export const createNewRole = async (
  input: CreateRoleInput,
) => {
  const existingRole = await findRoleByCode(
    input.code,
  );

  if (existingRole) {
    throw new Error("Role code sudah digunakan");
  }

  return createRole({
    name: input.name,
    code: input.code,
    ...(input.description !== undefined && {
      description: input.description,
    }),
  });
};

export const updateExistingRole = async (
  id: number,
  input: UpdateRoleInput,
) => {
  const existingRole = await findRoleById(id);

  if (!existingRole) {
    throw new Error("Role tidak ditemukan");
  }

  if (input.code) {
    const roleWithSameCode =
      await findRoleByCode(input.code);

    if (
      roleWithSameCode &&
      roleWithSameCode.id !== id
    ) {
      throw new Error("Role code sudah digunakan");
    }
  }

  const updateData = Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined,
    ),
  );

  return updateRole(id, updateData);
};

export const deleteExistingRole = async (
  id: number,
) => {
  const role = await findRoleById(id);

  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  if (role.code === "ADMIN") {
    throw new Error("Role ADMIN tidak boleh dihapus");
  }

  if (role._count.users > 0) {
    throw new Error(
      "Role masih digunakan oleh user",
    );
  }

  await deleteRole(id);
};