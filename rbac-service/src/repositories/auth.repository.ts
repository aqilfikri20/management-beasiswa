import { prisma } from "../config/prisma.js";

export const findUserForMe = async (
  userId: number,
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,

      role: {
        select: {
          id: true,
          name: true,
          code: true,

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
            orderBy: {
              permissionId: "asc",
            },
          },

          roleMenus: {
            select: {
              menu: {
                select: {
                  id: true,
                  parentId: true,
                  name: true,
                  code: true,
                  path: true,
                  icon: true,
                  sortOrder: true,
                  isActive: true,
                },
              },
            },
            orderBy: {
              menuId: "asc",
            },
          },
        },
      },
    },
  });
};

export const findUserByEmail = async (
  email: string,
) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findRoleByCode = async (
  code: string,
) => {
  return prisma.role.findUnique({
    where: {
      code,
    },
  });
};

/**
 * Membuat User baru.
 *
 * Repository RBAC hanya bertanggung jawab
 * terhadap entity User.
 *
 * Applicant dibuat oleh Transaction Service.
 */
export const createUser = async (data: {
  roleId: number;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
}) => {
  return prisma.user.create({
    data: {
      roleId: data.roleId,
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,

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

export const findUserByIdentifier = async (
  identifier: string,
) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          email: identifier,
        },
        {
          username: identifier,
        },
      ],
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
};