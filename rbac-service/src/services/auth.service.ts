import { prisma } from "../config/prisma.js";
import {
  comparePassword,
  hashPassword,
} from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/refresh-token.js";
import {
  findUserForMe,
  findUserByIdentifier,
  findUserByEmail,
  findRoleByCode,
  createUser,
} from "../repositories/auth.repository.js";
import {
  generateUsername,
  generateTemporaryPassword,
} from "../utils/credentials.js";
import type { RegisterApplicantInput } from "../validators/auth.validator.js";
export interface LoginInput {
  identifier: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: {
      id: number;
      name: string;
      code: string;
    };
    permissions: string[];
  };
}

export const login = async (
  input: LoginInput,
): Promise<LoginResult> => {
  const user = await findUserByIdentifier(input.identifier);

  if (!user) {
    throw new Error("Email/username atau password salah");
  }

  if (!user.isActive) {
    throw new Error("Akun tidak aktif");
  }

  const passwordValid = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordValid) {
    throw new Error("Email/username atau password salah");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  const permissions = user.role.rolePermissions.map(
    (item) => item.permission.code,
  );

  const accessToken = generateAccessToken({
    userId: user.id,
    roleId: user.roleId,
  });

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();

  // Refresh token berlaku 7 hari
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      permissions,
    },
  };
};

export const refreshAccessToken = async (
  refreshToken: string,
) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!storedToken) {
    throw new Error("Refresh token tidak valid");
  }

  if (storedToken.revokedAt) {
    throw new Error("Refresh token sudah tidak berlaku");
  }

  if (storedToken.expiresAt <= new Date()) {
    throw new Error("Refresh token sudah expired");
  }

  if (!storedToken.user.isActive) {
    throw new Error("Akun tidak aktif");
  }

  // Generate access token baru
  const accessToken = generateAccessToken({
    userId: storedToken.user.id,
    roleId: storedToken.user.roleId,
  });

  // Rotation:
  // revoke refresh token lama
  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  // Buat refresh token baru
  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: storedToken.user.id,
      tokenHash: newRefreshTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (
  refreshToken: string,
) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    return;
  }

  if (!storedToken.revokedAt) {
    await prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
};

export const getCurrentUser = async (userId: number) => {
  const user = await findUserForMe(userId);

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (!user.isActive) {
    throw new Error("User tidak aktif");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: {
      id: user.role.id,
      name: user.role.name,
      code: user.role.code,
    },
    permissions: user.role.rolePermissions.map(
      ({ permission }) => permission,
    ),
    menus: user.role.roleMenus
      .map(({ menu }) => menu)
      .filter((menu) => menu.isActive),
  };
};

export const registerApplicant = async (
  input: RegisterApplicantInput,
) => {
  const existingEmail = await findUserByEmail(
    input.email,
  );

  if (existingEmail) {
    throw new Error("Email sudah terdaftar");
  }

  const role = await findRoleByCode("PENDAFTAR");

  if (!role) {
    throw new Error(
      "Role PENDAFTAR tidak ditemukan",
    );
  }

  const username = generateUsername();

const temporaryPassword =
  generateTemporaryPassword();

const passwordHash = await hashPassword(
  temporaryPassword,
);

if (process.env.NODE_ENV !== "production") {
  console.log(
    `[DEV] Temporary password for ${input.email}: ${temporaryPassword}`,
  );
}

  const user = await createUser({
    roleId: role.id,
    username,
    email: input.email,
    passwordHash,
    fullName: input.fullName,
  });

  return {
    user,
    temporaryPassword,
  };
};