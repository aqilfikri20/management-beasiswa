import type { Request, Response } from "express";

import {
  createNewUser,
  deleteExistingUser,
  getUserById,
  getUsers,
  updateExistingUser,
} from "../services/user.service.js";

import {
  createUserSchema,
  updateUserSchema,
} from "../validators/user.validator.js";

export const getUsersController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const users = await getUsers();

    return res.json({
      message: "Data user berhasil diambil",
      data: users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil data user",
    });
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID user tidak valid",
      });
    }

    const user = await getUserById(id);

    return res.json({
      message: "Data user berhasil diambil",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "User tidak ditemukan",
    });
  }
};

export const createUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = createUserSchema.safeParse(
      req.body,
    );

    if (!result.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: result.error.flatten(),
      });
    }

    const user = await createNewUser(result.data);

    return res.status(201).json({
      message: "User berhasil dibuat",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat user",
    });
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID user tidak valid",
      });
    }

    const result = updateUserSchema.safeParse(
      req.body,
    );

    if (!result.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: result.error.flatten(),
      });
    }

    const user = await updateExistingUser(
      id,
      result.data,
    );

    return res.json({
      message: "User berhasil diperbarui",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui user",
    });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID user tidak valid",
      });
    }

    await deleteExistingUser(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal menghapus user",
    });
  }
};