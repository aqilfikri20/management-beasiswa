import { prisma } from "../config/prisma.js";

export const createDocument = async (data: {
  registrationId: number;
  documentType: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  status?: string;
}) => {
  return prisma.document.create({
    data,
  });
};

export const findDocumentById = async (id: number) => {
  return prisma.document.findUnique({
    where: { id },
  });
};

export const findDocumentsByRegistrationId = async (
  registrationId: number,
) => {
  return prisma.document.findMany({
    where: { registrationId },
    orderBy: { createdAt: "desc" },
  });
};

export const findDocumentByRegistrationAndType = async (
  registrationId: number,
  documentType: string,
) => {
  return prisma.document.findFirst({
    where: {
      registrationId,
      documentType,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};