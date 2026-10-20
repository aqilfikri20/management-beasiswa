import type { Request, Response } from "express";

import {
  getRoleMenus,
  updateRoleMenus,
} from "../services/role-menu.service.js";

import {
  updateRoleMenusSchema,
} from "../validators/role-menu.validator.js";

export const getRoleMenusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const roleId = Number(req.params.id);

    if (!Number.isInteger(roleId)) {
      return res.status(400).json({
        message: "ID role tidak valid",
      });
    }

    const menus = await getRoleMenus(roleId);

    return res.json(menus);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Role tidak ditemukan"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil menu role",
    });
  }
};

export const updateRoleMenusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const roleId = Number(req.params.id);

    if (!Number.isInteger(roleId)) {
      return res.status(400).json({
        message: "ID role tidak valid",
      });
    }

    const validation =
      updateRoleMenusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const result = await updateRoleMenus(
      roleId,
      validation.data.menuIds,
    );

    return res.json({
      message: "Menu role berhasil diperbarui",
      menus: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Role tidak ditemukan") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Satu atau lebih menu tidak ditemukan"
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal memperbarui menu role",
    });
  }
};