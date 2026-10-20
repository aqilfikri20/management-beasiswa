import { prisma } from "../config/prisma.js";

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserByUsername = async (
  username: string,
) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const createUser = async (data: {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  roleId: number;
}) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });
};

export const updateUser = async (
  id: number,
  data: {
    username?: string;
    email?: string;
    fullName?: string;
    roleId?: number;
    isActive?: boolean;
  },
) => {
  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};