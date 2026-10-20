import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum dikonfigurasi");
}

export interface AuthenticatedUser {
  userId: number;
  roleId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Access token diperlukan",
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Format Authorization tidak valid",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "number" ||
      typeof payload.roleId !== "number"
    ) {
      return res.status(401).json({
        message: "Access token tidak valid",
      });
    }

    req.user = {
      userId: payload.userId,
      roleId: payload.roleId,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Access token tidak valid atau sudah expired",
    });
  }
};