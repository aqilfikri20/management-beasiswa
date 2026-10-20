import { prisma } from "../config/prisma.js";

export const createProgram = async (data: {
  title: string;
  description: string;
  deadline: Date;
  method: string;
  quota: number;
  status?: string;
}) => {
  return prisma.program.create({
    data,
  });
};

export const findAllPrograms = async () => {
  return prisma.program.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findProgramById = async (id: number) => {
  return prisma.program.findUnique({
    where: { id },
    include: {
      requirements: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const updateProgram = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    deadline?: Date;
    method?: string;
    quota?: number;
    status?: string;
  },
) => {
  return prisma.program.update({
    where: { id },
    data,
  });
};

export const deleteProgram = async (id: number) => {
  return prisma.program.delete({
    where: { id },
  });
};