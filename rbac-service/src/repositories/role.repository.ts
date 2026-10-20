import { prisma } from "../config/prisma.js";

export const findAllRoles = async () => {
  return prisma.role.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          users: true,
          rolePermissions: true,
          roleMenus: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const findRoleById = async (id: number) => {
  return prisma.role.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      rolePermissions: {
        select: {
          permission: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
            },
          },
        },
      },
      roleMenus: {
        select: {
          menu: {
            select: {
              id: true,
              name: true,
              code: true,
              path: true,
              icon: true,
              parentId: true,
              sortOrder: true,
            },
          },
        },
      },
      _count: {
        select: {
            users: true,
            rolePermissions: true,
            roleMenus: true,
        },
    },
    },
  });
};

export const findRoleByCode = async (code: string) => {
  return prisma.role.findUnique({
    where: {
      code,
    },
  });
};

export const createRole = async (data: {
  name: string;
  code: string;
  description?: string;
}) => {
  return prisma.role.create({
    data,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateRole = async (
  id: number,
  data: {
    name?: string;
    code?: string;
    description?: string;
    isActive?: boolean;
  },
) => {
  return prisma.role.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteRole = async (id: number) => {
  return prisma.role.delete({
    where: {
      id,
    },
  });
};