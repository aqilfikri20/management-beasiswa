import type { Request, Response } from "express";

import {
  createNewMenu,
  deleteExistingMenu,
  getMenuById,
  getMenus,
  updateExistingMenu,
} from "../services/menu.service.js";

import {
  createMenuSchema,
  updateMenuSchema,
} from "../validators/menu.validator.js";

export const getMenusController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const menus = await getMenus();

    return res.json(menus);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil data menu",
    });
  }
};

export const getMenuByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID menu tidak valid",
      });
    }

    const menu = await getMenuById(id);

    return res.json(menu);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Menu tidak ditemukan"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil menu",
    });
  }
};

export const createMenuController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation =
      createMenuSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const menu = await createNewMenu(validation.data);

    return res.status(201).json(menu);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Menu code sudah digunakan"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message === "Parent menu tidak ditemukan"
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal membuat menu",
    });
  }
};

export const updateMenuController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID menu tidak valid",
      });
    }

    const validation =
      updateMenuSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validation.error.flatten(),
      });
    }

    const menu = await updateExistingMenu(
      id,
      validation.data,
    );

    return res.json(menu);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Menu tidak ditemukan") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message === "Menu code sudah digunakan"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message === "Parent menu tidak ditemukan" ||
        error.message ===
          "Menu tidak boleh menjadi parent dirinya sendiri"
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal mengubah menu",
    });
  }
};

export const deleteMenuController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID menu tidak valid",
      });
    }

    await deleteExistingMenu(id);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Menu tidak ditemukan") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
          "Menu masih memiliki child menu" ||
        error.message ===
          "Menu masih digunakan oleh role"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Gagal menghapus menu",
    });
  }
};