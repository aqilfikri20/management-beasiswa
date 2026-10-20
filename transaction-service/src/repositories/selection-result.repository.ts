import { prisma } from "../config/prisma.js";

export const createSelectionResult = async (
  data: {
    registrationId: number;
    result: string;
    finalScore?: number;
    notes?: string;
    announcedAt?: Date;
  },
) => {
  return prisma.selectionResult.create({
    data,
  });
};

export const findSelectionResultByRegistrationId =
  async (registrationId: number) => {
    return prisma.selectionResult.findUnique({
      where: {
        registrationId,
      },
    });
  };

export const findAllSelectionResults = async () => {
  return prisma.selectionResult.findMany({
    include: {
      registration: { include: { applicant: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateSelectionResult = async (
  id: number,
  data: {
    result?: string;
    finalScore?: number;
    notes?: string;
    announcedAt?: Date;
  },
) => {
  return prisma.selectionResult.update({
    where: {
      id,
    },
    data,
  });
};
