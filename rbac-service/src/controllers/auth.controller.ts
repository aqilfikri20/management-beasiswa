import type { Request, Response } from "express";

import {
  login,
  refreshAccessToken,
  getCurrentUser,
  logout,
  registerApplicant,
} from "../services/auth.service.js";

import {
  validateRegisterApplicant,
} from "../validators/auth.validator.js";

/**
 * POST /auth/login
 */
export const loginController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      typeof req.body.identifier !== "string" ||
      typeof req.body.password !== "string"
    ) {
      return res.status(400).json({
        message:
          "Identifier dan password wajib diisi",
      });
    }

    const result = await login({
      identifier: req.body.identifier,
      password: req.body.password,
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login berhasil",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login gagal",
    });
  }
};

/**
 * POST /auth/refresh
 */
export const refreshController = async (
  req: Request,
  res: Response,
) => {
  try {
    const refreshToken =
      req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        message:
          "Refresh token tidak ditemukan",
      });
    }

    const result =
      await refreshAccessToken(refreshToken);

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token berhasil diperbarui",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Refresh token tidak valid",
    });
  }
};

/**
 * POST /auth/logout
 */
export const logoutController = async (
  req: Request,
  res: Response,
) => {
  try {
    const refreshToken =
      req.cookies.refresh_token;

    if (refreshToken) {
      await logout(refreshToken);
    }

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    });

    return res.status(200).json({
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Logout gagal",
    });
  }
};

/**
 * GET /auth/me
 */
export const meController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await getCurrentUser(
      req.user.userId,
    );

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message ===
          "User tidak ditemukan" ||
        error.message ===
          "User tidak aktif"
      ) {
        return res.status(401).json({
          message: error.message,
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Gagal mengambil data user",
    });
  }
};

/**
 * POST /auth/register
 *
 * Membuat akun User dengan role PENDAFTAR.
 *
 * Applicant/NIK dibuat oleh Transaction Service,
 * bukan oleh RBAC Service.
 */
export const registerController = async (
  req: Request,
  res: Response,
) => {
  try {
    const input =
      validateRegisterApplicant(req.body);

    const result =
      await registerApplicant(input);

return res.status(201).json({
  message:
    "Registrasi berhasil. Username dan password sementara akan dikirimkan ke email.",
  user: result.user,
  ...(process.env.NODE_ENV !== "production"
    ? { temporaryPassword: result.temporaryPassword }
    : {}),
});
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message ===
        "Email sudah terdaftar"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Registrasi gagal",
    });
  }
};
