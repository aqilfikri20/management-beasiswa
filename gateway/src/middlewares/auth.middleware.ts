import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  roleId: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateGateway = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access token diperlukan",
    });
  }

  const token = authorization.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Access token diperlukan",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET belum dikonfigurasi");

    return res.status(500).json({
      message: "Konfigurasi server tidak lengkap",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== "object" || decoded === null) {
      return res.status(401).json({
        message: "Access token tidak valid",
      });
    }

    req.user = decoded as JwtPayload;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Access token sudah kedaluwarsa",
      });
    }

    return res.status(401).json({
      message: "Access token tidak valid",
    });
  }
};