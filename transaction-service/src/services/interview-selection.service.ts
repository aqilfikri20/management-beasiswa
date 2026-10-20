import { prisma } from "../config/prisma.js";

import {
  createInterviewSelection,
  findInterviewSelectionByRegistrationId,
  findAllInterviewSelections,
  updateInterviewSelection,
} from "../repositories/interview-selection.repository.js";

import {
  validateCreateInterviewSelection,
  validateUpdateInterviewSelection,
} from "../validators/interview-selection.validator.js";

export const createInterviewSelectionService =
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

    if (registration.status !== "ADMIN_PASSED") {
      throw new Error(
        "Pendaftaran belum lolos seleksi administrasi",
      );
    }

    const existing =
      await findInterviewSelectionByRegistrationId(
        registrationId,
      );

    if (existing) {
      throw new Error(
        "Seleksi wawancara sudah tersedia",
      );
    }

    const data =
      validateCreateInterviewSelection(input);

    const selection =
      await createInterviewSelection({
        registrationId,
        status: data.status,
        ...(data.scheduledAt !== undefined && {
          scheduledAt: data.scheduledAt,
        }),
        ...(data.score !== undefined && {
          score: data.score,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes,
        }),
        interviewerId: userId,
        ...(data.status === "PASSED" ||
        data.status === "FAILED"
          ? {
              interviewedAt: new Date(),
            }
          : {}),
      });

    let registrationStatus =
      "INTERVIEW_SCHEDULED";

    if (data.status === "PASSED") {
      registrationStatus = "INTERVIEW_PASSED";
    }

    if (data.status === "FAILED") {
      registrationStatus = "INTERVIEW_FAILED";
    }

    await prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: registrationStatus,
      },
    });

    return selection;
  };

export const getInterviewSelectionService =
  async (registrationId: number) => {
    return findInterviewSelectionByRegistrationId(
      registrationId,
    );
  };

export const getAllInterviewSelectionsService =
  async () => {
    return findAllInterviewSelections();
  };

export const updateInterviewSelectionService =
  async (
    registrationId: number,
    userId: number,
    input: unknown,
  ) => {
    const existing =
      await findInterviewSelectionByRegistrationId(
        registrationId,
      );

    if (!existing) {
      throw new Error(
        "Seleksi wawancara tidak ditemukan",
      );
    }

    const data =
      validateUpdateInterviewSelection(input);

    const updateData: {
      status?: string;
      scheduledAt?: Date;
      score?: number;
      notes?: string;
      interviewerId: number;
      interviewedAt?: Date;
    } = {
      interviewerId: userId,
    };

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.scheduledAt !== undefined) {
      updateData.scheduledAt = data.scheduledAt;
    }

    if (data.score !== undefined) {
      updateData.score = data.score;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    if (
      data.status === "PASSED" ||
      data.status === "FAILED"
    ) {
      updateData.interviewedAt = new Date();
    }

    const selection =
      await updateInterviewSelection(
        existing.id,
        updateData,
      );

    if (data.status !== undefined) {
      let registrationStatus =
        "INTERVIEW_SCHEDULED";

      if (data.status === "PASSED") {
        registrationStatus = "INTERVIEW_PASSED";
      }

      if (data.status === "FAILED") {
        registrationStatus = "INTERVIEW_FAILED";
      }

      await prisma.registration.update({
        where: {
          id: registrationId,
        },
        data: {
          status: registrationStatus,
        },
      });
    }

    return selection;
  };