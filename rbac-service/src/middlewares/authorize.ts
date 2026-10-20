import type { NextFunction, Request, Response } from "express";

import { prisma } from "../config/prisma.js";

export const authorize = (requiredPermission: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const permission =
        await prisma.rolePermission.findFirst({
          where: {
            roleId: req.user.roleId,
            permission: {
              code: requiredPermission,
            },
          },
        });

      if (!permission) {
        return res.status(403).json({
          message: "Anda tidak memiliki permission untuk melakukan aksi ini",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Gagal memeriksa permission",
      });
    }
  };
};