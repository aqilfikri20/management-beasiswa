import type { Request, Response } from "express";

import { prisma } from "../config/prisma.js";

export const checkPermissionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { roleId, permission } = req.body;

    if (
      typeof roleId !== "number" ||
      !Number.isInteger(roleId) ||
      roleId <= 0
    ) {
      return res.status(400).json({
        message: "roleId tidak valid",
      });
    }

    if (
      typeof permission !== "string" ||
      !permission.trim()
    ) {
      return res.status(400).json({
        message: "permission tidak valid",
      });
    }

    const rolePermission =
      await prisma.rolePermission.findFirst({
        where: {
          roleId,
          permission: {
            code: permission,
          },
        },
      });

    return res.status(200).json({
      allowed: Boolean(rolePermission),
    });
  } catch (error) {
    console.error(
      "Internal permission check error:",
      error,
    );

    return res.status(500).json({
      message: "Gagal memeriksa permission",
    });
  }
};