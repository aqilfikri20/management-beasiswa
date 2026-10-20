import type { Request, Response } from "express";

import {
  createNewRole,
  deleteExistingRole,
  getRoleById,
  getRoles,
  updateExistingRole,
} from "../services/role.service.js";

import {
  createRoleSchema,
  updateRoleSchema,
} from "../validators/role.validator.js";

export const getRolesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const roles = await getRoles();

    return res.json({
      message: "Data role berhasil diambil",
      data: roles,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil data role",
    });
  }
};

export const getRoleByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID role tidak valid",
      });
    }

    const role = await getRoleById(id);

    return res.json({
      message: "Data role berhasil diambil",
      data: role,
    });
  } catch (error) {
    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Role tidak ditemukan",
    });
  }
};

export const createRoleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = createRoleSchema.safeParse(
      req.body,
    );

    if (!result.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: result.error.flatten(),
      });
    }

    const role = await createNewRole(result.data);

    return res.status(201).json({
      message: "Role berhasil dibuat",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat role",
    });
  }
};

export const updateRoleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID role tidak valid",
      });
    }

    const result = updateRoleSchema.safeParse(
      req.body,
    );

    if (!result.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: result.error.flatten(),
      });
    }

    const role = await updateExistingRole(
      id,
      result.data,
    );

    return res.json({
      message: "Role berhasil diperbarui",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui role",
    });
  }
};

export const deleteRoleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID role tidak valid",
      });
    }

    await deleteExistingRole(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal menghapus role",
    });
  }
};