import { prisma } from "../config/prisma.js";

export const createInterviewSelection = async (
  data: {
    registrationId: number;
    status: string;
    scheduledAt?: Date;
    score?: number;
    notes?: string;
    interviewerId: number;
    interviewedAt?: Date;
  },
) => {
  return prisma.interviewSelection.create({
    data,
  });
};

export const findInterviewSelectionByRegistrationId =
  async (registrationId: number) => {
    return prisma.interviewSelection.findUnique({
      where: {
        registrationId,
      },
    });
  };

export const findAllInterviewSelections = async () => {
  return prisma.interviewSelection.findMany({
    include: {
      registration: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateInterviewSelection = async (
  id: number,
  data: {
    status?: string;
    scheduledAt?: Date;
    score?: number;
    notes?: string;
    interviewerId?: number;
    interviewedAt?: Date;
  },
) => {
  return prisma.interviewSelection.update({
    where: {
      id,
    },
    data,
  });
};