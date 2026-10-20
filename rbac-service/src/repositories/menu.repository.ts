import { prisma } from "../config/prisma.js";

export const findAllMenus = async () => {
  return prisma.menu.findMany({
    select: {
      id: true,
      parentId: true,
      name: true,
      code: true,
      path: true,
      icon: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          roleMenus: true,
        },
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        id: "asc",
      },
    ],
  });
};

export const findMenuById = async (id: number) => {
  return prisma.menu.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      parentId: true,
      name: true,
      code: true,
      path: true,
      icon: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      parent: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          code: true,
          path: true,
          icon: true,
          sortOrder: true,
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      roleMenus: {
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

export const findMenuByCode = async (code: string) => {
  return prisma.menu.findUnique({
    where: {
      code,
    },
  });
};

export const createMenu = async (data: {
  parentId?: number;
  name: string;
  code: string;
  path?: string;
  icon?: string;
  sortOrder?: number;
}) => {
  return prisma.menu.create({
    data,
    select: {
      id: true,
      parentId: true,
      name: true,
      code: true,
      path: true,
      icon: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateMenu = async (
  id: number,
  data: {
    parentId?: number | null;
    name?: string;
    code?: string;
    path?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) => {
  return prisma.menu.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      parentId: true,
      name: true,
      code: true,
      path: true,
      icon: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteMenu = async (id: number) => {
  return prisma.menu.delete({
    where: {
      id,
    },
  });
};