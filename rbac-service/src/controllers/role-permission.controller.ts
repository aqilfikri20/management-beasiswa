import type { Request, Response } from "express";

import {
  getRolePermissions,
  updateRolePermissions,
} from "../services/role-permission.service.js";

import {
  updateRolePermissionsSchema,
} from "../validators/role-permission.validator.js";

export const getRolePermissionsController = async (
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

    const permissions =
      await getRolePermissions(roleId);

    return res.json(permissions);
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
      message: "Gagal mengambil permission role",
    });
  }
};

export const updateRolePermissionsController = async (
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
      updateRolePermissionsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const result = await updateRolePermissions(
      roleId,
      validation.data.permissionIds,
    );

    return res.json({
      message: "Permission role berhasil diperbarui",
      permissions: result,
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
        "Satu atau lebih permission tidak ditemukan"
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal memperbarui permission role",
    });
  }
};