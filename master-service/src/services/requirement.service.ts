import {
  createRequirement,
  findRequirementsByProgramId,
  findRequirementById,
  updateRequirement,
  deleteRequirement,
} from "../repositories/requirement.repository.js";

import {
  validateCreateRequirement,
  validateUpdateRequirement,
} from "../validators/requirement.validator.js";

import { prisma } from "../config/prisma.js";

export const createRequirementService = async (
  programId: number,
  input: unknown,
) => {
  const program = await prisma.program.findUnique({
    where: {
      id: programId,
    },
  });

  if (!program) {
    throw new Error("Program tidak ditemukan");
  }

  const data = validateCreateRequirement(input);

  return createRequirement({
    programId,
    name: data.name,
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.isRequired !== undefined && {
      isRequired: data.isRequired,
    }),
    ...(data.allowedFileTypes !== undefined && {
      allowedFileTypes: data.allowedFileTypes,
    }),
    ...(data.maxFileSize !== undefined && {
      maxFileSize: data.maxFileSize,
    }),
    ...(data.sortOrder !== undefined && {
      sortOrder: data.sortOrder,
    }),
  });
};

export const getRequirementsByProgramIdService = async (
  programId: number,
) => {
  return findRequirementsByProgramId(programId);
};

export const getRequirementByIdService = async (
  id: number,
) => {
  return findRequirementById(id);
};

export const updateRequirementService = async (
  id: number,
  input: unknown,
) => {
  const data = validateUpdateRequirement(input);

  const updateData = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined,
    ),
  ) as {
    name?: string;
    description?: string;
    isRequired?: boolean;
    allowedFileTypes?: string;
    maxFileSize?: number;
    sortOrder?: number;
  };

  return updateRequirement(id, updateData);
};

export const deleteRequirementService = async (
  id: number,
) => {
  return deleteRequirement(id);
};