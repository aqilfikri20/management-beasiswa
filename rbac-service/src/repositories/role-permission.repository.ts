import { prisma } from "../config/prisma.js";

export const findRolePermissions = async (roleId: number) => {
  return prisma.rolePermission.findMany({
    where: {
      roleId,
    },
    select: {
      roleId: true,
      permissionId: true,
      permission: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      },
    },
    orderBy: {
      permissionId: "asc",
    },
  });
};

export const findRoleByIdForPermissionAssignment = async (
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

export const findPermissionsByIds = async (
  permissionIds: number[],
) => {
  return prisma.permission.findMany({
    where: {
      id: {
        in: permissionIds,
      },
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });
};

export const replaceRolePermissions = async (
  roleId: number,
  permissionIds: number[],
) => {
  return prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    if (permissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }

    return tx.rolePermission.findMany({
      where: {
        roleId,
      },
      select: {
        roleId: true,
        permissionId: true,
        permission: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
          },
        },
      },
      orderBy: {
        permissionId: "asc",
      },
    });
  });
};