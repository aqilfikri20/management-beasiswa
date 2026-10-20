import { prisma } from "../config/prisma.js";

export const findRoleMenus = async (roleId: number) => {
  return prisma.roleMenu.findMany({
    where: {
      roleId,
    },
    select: {
      roleId: true,
      menuId: true,
      menu: {
        select: {
          id: true,
          name: true,
          code: true,
          path: true,
          icon: true,
          parentId: true,
          sortOrder: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      menu: {
        sortOrder: "asc",
      },
    },
  });
};

export const findRoleByIdForMenuAssignment = async (
  roleId: number,
) => {
  return prisma.role.findUnique({
    where: {
      id: roleId,
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });
};

export const findMenusByIds = async (
  menuIds: number[],
) => {
  return prisma.menu.findMany({
    where: {
      id: {
        in: menuIds,
      },
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });
};

export const replaceRoleMenus = async (
  roleId: number,
  menuIds: number[],
) => {
  return prisma.$transaction(async (tx) => {
    await tx.roleMenu.deleteMany({
      where: {
        roleId,
      },
    });

    if (menuIds.length > 0) {
      await tx.roleMenu.createMany({
        data: menuIds.map((menuId) => ({
          roleId,
          menuId,
        })),
      });
    }

    return tx.roleMenu.findMany({
      where: {
        roleId,
      },
      select: {
        roleId: true,
        menuId: true,
        menu: {
          select: {
            id: true,
            name: true,
            code: true,
            path: true,
            icon: true,
            parentId: true,
            sortOrder: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        menu: {
          sortOrder: "asc",
        },
      },
    });
  });
};