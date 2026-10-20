import {
  createMenu,
  deleteMenu,
  findAllMenus,
  findMenuByCode,
  findMenuById,
  updateMenu,
} from "../repositories/menu.repository.js";

import type {
  CreateMenuInput,
  UpdateMenuInput,
} from "../validators/menu.validator.js";

export const getMenus = async () => {
  return findAllMenus();
};

export const getMenuById = async (id: number) => {
  const menu = await findMenuById(id);

  if (!menu) {
    throw new Error("Menu tidak ditemukan");
  }

  return menu;
};

export const createNewMenu = async (
  input: CreateMenuInput,
) => {
  const existingMenu = await findMenuByCode(input.code);

  if (existingMenu) {
    throw new Error("Menu code sudah digunakan");
  }

  if (input.parentId !== undefined) {
    const parent = await findMenuById(input.parentId);

    if (!parent) {
      throw new Error("Parent menu tidak ditemukan");
    }
  }

  return createMenu({
    name: input.name,
    code: input.code,
    ...(input.parentId !== undefined && {
      parentId: input.parentId,
    }),
    ...(input.path !== undefined && {
      path: input.path,
    }),
    ...(input.icon !== undefined && {
      icon: input.icon,
    }),
    ...(input.sortOrder !== undefined && {
      sortOrder: input.sortOrder,
    }),
  });
};

export const updateExistingMenu = async (
  id: number,
  input: UpdateMenuInput,
) => {
  const existingMenu = await findMenuById(id);

  if (!existingMenu) {
    throw new Error("Menu tidak ditemukan");
  }

  if (input.code) {
    const menuWithSameCode = await findMenuByCode(input.code);

    if (
      menuWithSameCode &&
      menuWithSameCode.id !== id
    ) {
      throw new Error("Menu code sudah digunakan");
    }
  }

  if (input.parentId !== undefined && input.parentId !== null) {
    if (input.parentId === id) {
      throw new Error("Menu tidak boleh menjadi parent dirinya sendiri");
    }

    const parent = await findMenuById(input.parentId);

    if (!parent) {
      throw new Error("Parent menu tidak ditemukan");
    }
  }

  const updateData = Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined,
    ),
  );

  return updateMenu(id, updateData);
};

export const deleteExistingMenu = async (id: number) => {
  const menu = await findMenuById(id);

  if (!menu) {
    throw new Error("Menu tidak ditemukan");
  }

  if (menu.children.length > 0) {
    throw new Error(
      "Menu masih memiliki child menu",
    );
  }

  if (menu.roleMenus.length > 0) {
    throw new Error(
      "Menu masih digunakan oleh role",
    );
  }

  await deleteMenu(id);
};