import { prisma } from "../config/prisma.js";

export const createAdministrativeSelection = async (
  data: {
    registrationId: number;
    status: string;
    score?: number;
    notes?: string;
    verifiedBy: number;
    verifiedAt: Date;
  },
) => {
  return prisma.administrativeSelection.create({
    data,
  });
};

export const findAdministrativeSelectionByRegistrationId =
  async (registrationId: number) => {
    return prisma.administrativeSelection.findUnique({
      where: {
        registrationId,
      },
    });
  };

export const findAllAdministrativeSelections = async () => {
  return prisma.administrativeSelection.findMany({
    include: {
      registration: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateAdministrativeSelection = async (
  id: number,
  data: {
    status?: string;
    score?: number;
    notes?: string;
    verifiedBy?: number;
    verifiedAt?: Date;
  },
) => {
  return prisma.administrativeSelection.update({
    where: {
      id,
    },
    data,
  });
};