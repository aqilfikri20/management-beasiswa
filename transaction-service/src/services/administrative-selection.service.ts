import { prisma } from "../config/prisma.js";

import {
  createAdministrativeSelection,
  findAdministrativeSelectionByRegistrationId,
  findAllAdministrativeSelections,
  updateAdministrativeSelection,
} from "../repositories/administrative-selection.repository.js";

import {
  validateCreateAdministrativeSelection,
  validateUpdateAdministrativeSelection,
} from "../validators/administrative-selection.validator.js";

export const createAdministrativeSelectionService =
  async (
    registrationId: number,
    userId: number,
    input: unknown,
  ) => {
    const registration =
      await prisma.registration.findUnique({
        where: {
          id: registrationId,
        },
      });

    if (!registration) {
      throw new Error(
        "Pendaftaran tidak ditemukan",
      );
    }

    if (registration.status !== "SUBMITTED") {
      throw new Error(
        "Pendaftaran belum dapat diproses untuk seleksi administrasi",
      );
    }

    const existing =
      await findAdministrativeSelectionByRegistrationId(
        registrationId,
      );

    if (existing) {
      throw new Error(
        "Seleksi administrasi sudah tersedia",
      );
    }

    const data =
      validateCreateAdministrativeSelection(input);

    const selection =
      await createAdministrativeSelection({
        registrationId,
        status: data.status,
        ...(data.score !== undefined && {
          score: data.score,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes,
        }),
        verifiedBy: userId,
        verifiedAt: new Date(),
      });

    await prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: data.status === "PASSED" ? "ADMIN_PASSED" : data.status === "REVISION" ? "REVISION_REQUESTED" : "ADMIN_FAILED",
      },
    });

    return selection;
  };

export const getAdministrativeSelectionService =
  async (registrationId: number) => {
    return findAdministrativeSelectionByRegistrationId(
      registrationId,
    );
  };

export const getAllAdministrativeSelectionsService =
  async () => {
    return findAllAdministrativeSelections();
  };

export const updateAdministrativeSelectionService =
  async (
    registrationId: number,
    userId: number,
    input: unknown,
  ) => {
    const existing =
      await findAdministrativeSelectionByRegistrationId(
        registrationId,
      );

    if (!existing) {
      throw new Error(
        "Seleksi administrasi tidak ditemukan",
      );
    }

    const data =
      validateUpdateAdministrativeSelection(input);

    const updateData: {
      status?: string;
      score?: number;
      notes?: string;
      verifiedBy: number;
      verifiedAt: Date;
    } = {
      verifiedBy: userId,
      verifiedAt: new Date(),
    };

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.score !== undefined) {
      updateData.score = data.score;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const selection =
      await updateAdministrativeSelection(
        existing.id,
        updateData,
      );

    if (data.status !== undefined) {
      await prisma.registration.update({
        where: {
          id: registrationId,
        },
        data: {
          status: data.status === "PASSED" ? "ADMIN_PASSED" : data.status === "REVISION" ? "REVISION_REQUESTED" : "ADMIN_FAILED",
        },
      });
    }

    return selection;
  };
