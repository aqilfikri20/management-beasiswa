import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  roleId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization =
    req.headers.authorization;

  if (
    !authorization?.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authorization.substring(7);

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET belum dikonfigurasi",
      );
    }

    const payload = jwt.verify(
      token,
      secret,
    ) as JwtPayload;

    if (
      typeof payload.userId !== "number" ||
      typeof payload.roleId !== "number"
    ) {
      return res.status(401).json({
        message: "Token tidak valid",
      });
    }

    req.user = {
      userId: payload.userId,
      roleId: payload.roleId,
    };

    next();
  } catch {
    return res.status(401).json({
      message:
        "Token tidak valid atau sudah expired",
    });
  }
};