import { prisma } from "../config/prisma.js";

export const createRequirement = async (data: {
  programId: number;
  name: string;
  description?: string;
  isRequired?: boolean;
  allowedFileTypes?: string;
  maxFileSize?: number;
  sortOrder?: number;
}) => {
  return prisma.requirement.create({
    data,
  });
};

export const findRequirementsByProgramId = async (
  programId: number,
) => {
  return prisma.requirement.findMany({
    where: {
      programId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const findRequirementById = async (id: number) => {
  return prisma.requirement.findUnique({
    where: {
      id,
    },
  });
};

export const updateRequirement = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    isRequired?: boolean;
    allowedFileTypes?: string;
    maxFileSize?: number;
    sortOrder?: number;
  },
) => {
  return prisma.requirement.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteRequirement = async (id: number) => {
  return prisma.requirement.delete({
    where: {
      id,
    },
  });
};