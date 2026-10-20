import {
  findPermissionsByIds,
  findRoleByIdForPermissionAssignment,
  findRolePermissions,
  replaceRolePermissions,
} from "../repositories/role-permission.repository.js";

export const getRolePermissions = async (
  roleId: number,
) => {
  const role =
    await findRoleByIdForPermissionAssignment(roleId);

  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  return findRolePermissions(roleId);
};

export const updateRolePermissions = async (
  roleId: number,
  permissionIds: number[],
) => {
  const role =
    await findRoleByIdForPermissionAssignment(roleId);

  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  const uniquePermissionIds = [
    ...new Set(permissionIds),
  ];

  const permissions = await findPermissionsByIds(
    uniquePermissionIds,
  );

  if (
    permissions.length !==
    uniquePermissionIds.length
  ) {
    throw new Error(
      "Satu atau lebih permission tidak ditemukan",
    );
  }

  return replaceRolePermissions(
    roleId,
    uniquePermissionIds,
  );
};