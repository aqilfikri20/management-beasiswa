import {
  findMenusByIds,
  findRoleByIdForMenuAssignment,
  findRoleMenus,
  replaceRoleMenus,
} from "../repositories/role-menu.repository.js";

export const getRoleMenus = async (roleId: number) => {
  const role =
    await findRoleByIdForMenuAssignment(roleId);

  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  return findRoleMenus(roleId);
};

export const updateRoleMenus = async (
  roleId: number,
  menuIds: number[],
) => {
  const role =
    await findRoleByIdForMenuAssignment(roleId);

  if (!role) {
    throw new Error("Role tidak ditemukan");
  }

  const uniqueMenuIds = [...new Set(menuIds)];

  const menus = await findMenusByIds(uniqueMenuIds);

  if (menus.length !== uniqueMenuIds.length) {
    throw new Error(
      "Satu atau lebih menu tidak ditemukan",
    );
  }

  return replaceRoleMenus(roleId, uniqueMenuIds);
};