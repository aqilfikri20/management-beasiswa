import { prisma } from "../config/prisma.js";

export const findAllPermissions = async () => {
  return prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          rolePermissions: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const findPermissionById = async (id: number) => {
  return prisma.permission.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      rolePermissions: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
};

export const findPermissionByCode = async (code: string) => {
  return prisma.permission.findUnique({
    where: {
      code,
    },
  });
};

export const createPermission = async (data: {
  name: string;
  code: string;
  description?: string;
}) => {
  return prisma.permission.create({
    data,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updatePermission = async (
  id: number,
  data: {
    name?: string;
    code?: string;
    description?: string;
  },
) => {
  return prisma.permission.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deletePermission = async (id: number) => {
  return prisma.permission.delete({
    where: {
      id,
    },
  });
};