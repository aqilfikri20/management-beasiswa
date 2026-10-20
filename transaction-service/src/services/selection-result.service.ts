import { prisma } from "../config/prisma.js";

import {
  createSelectionResult,
  findSelectionResultByRegistrationId,
  findAllSelectionResults,
  updateSelectionResult,
} from "../repositories/selection-result.repository.js";

import {
  validateCreateSelectionResult,
  validateUpdateSelectionResult,
} from "../validators/selection-result.validator.js";

export const createSelectionResultService =
  async (
    registrationId: number,
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

    if (registration.status !== "INTERVIEW_PASSED") {
      throw new Error(
        "Pendaftaran belum menyelesaikan seleksi wawancara",
      );
    }

    const existing =
      await findSelectionResultByRegistrationId(
        registrationId,
      );

    if (existing) {
      throw new Error(
        "Hasil seleksi sudah tersedia",
      );
    }

    const data =
      validateCreateSelectionResult(input);

    const result =
      await createSelectionResult({
        registrationId,
        result: data.result,
        ...(data.finalScore !== undefined && {
          finalScore: data.finalScore,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes,
        }),
        announcedAt: new Date(),
      });

    await prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status:
          data.result === "PASSED"
            ? "FINAL_PASSED"
            : "FINAL_FAILED",
      },
    });

    return result;
  };

export const getSelectionResultService =
  async (registrationId: number) => {
    return findSelectionResultByRegistrationId(
      registrationId,
    );
  };

export const getAllSelectionResultsService =
  async () => {
    return findAllSelectionResults();
  };

export const updateSelectionResultService =
  async (
    registrationId: number,
    input: unknown,
  ) => {
    const existing =
      await findSelectionResultByRegistrationId(
        registrationId,
      );

    if (!existing) {
      throw new Error(
        "Hasil seleksi tidak ditemukan",
      );
    }

    const data =
      validateUpdateSelectionResult(input);

    const updateData: {
      result?: string;
      finalScore?: number;
      notes?: string;
      announcedAt: Date;
    } = {
      announcedAt: new Date(),
    };

    if (data.result !== undefined) {
      updateData.result = data.result;
    }

    if (data.finalScore !== undefined) {
      updateData.finalScore = data.finalScore;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const result =
      await updateSelectionResult(
        existing.id,
        updateData,
      );

    if (data.result !== undefined) {
      await prisma.registration.update({
        where: {
          id: registrationId,
        },
        data: {
          status:
            data.result === "PASSED"
              ? "FINAL_PASSED"
              : "FINAL_FAILED",
        },
      });
    }

    return result;
  };