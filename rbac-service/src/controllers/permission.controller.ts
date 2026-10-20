import type { Request, Response } from "express";

import {
  createNewPermission,
  deleteExistingPermission,
  getPermissionById,
  getPermissions,
  updateExistingPermission,
} from "../services/permission.service.js";

import {
  createPermissionSchema,
  updatePermissionSchema,
} from "../validators/permission.validator.js";

export const getPermissionsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const permissions = await getPermissions();

    return res.json(permissions);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil data permission",
    });
  }
};

export const getPermissionByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID permission tidak valid",
      });
    }

    const permission = await getPermissionById(id);

    return res.json(permission);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Permission tidak ditemukan"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil permission",
    });
  }
};

export const createPermissionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation =
      createPermissionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const permission = await createNewPermission(
      validation.data,
    );

    return res.status(201).json(permission);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Permission code sudah digunakan"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal membuat permission",
    });
  }
};

export const updatePermissionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID permission tidak valid",
      });
    }

    const validation =
      updatePermissionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const permission = await updateExistingPermission(
      id,
      validation.data,
    );

    return res.json(permission);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Permission tidak ditemukan") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Permission code sudah digunakan"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal mengubah permission",
    });
  }
};

export const deletePermissionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID permission tidak valid",
      });
    }

    await deleteExistingPermission(id);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Permission tidak ditemukan") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "Permission masih digunakan oleh role"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal menghapus permission",
    });
  }
};