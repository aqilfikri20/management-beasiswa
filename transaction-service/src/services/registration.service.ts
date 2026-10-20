import {
  createRegistration,
  findAllRegistrations,
  findRegistrationById,
  findRegistrationsByUserId,
  findRegistrationByIdAndUserId,
  findRegistrationByApplicantAndProgram,
  updateRegistration,
  deleteRegistration,
  checkRegistrationAccess,
} from "../repositories/registration.repository.js";

import {
  validateCreateRegistration,
} from "../validators/registration.validator.js";

import { prisma } from "../config/prisma.js";

export const createRegistrationService = async (
  userId: number,
  input: unknown,
) => {
  const data = validateCreateRegistration(input);

  const applicant = await prisma.applicant.findUnique({
    where: {
      userId,
    },
  });

  if (!applicant) {
    throw new Error("Applicant belum dibuat");
  }

  const existingRegistration =
    await findRegistrationByApplicantAndProgram(
      applicant.id,
      data.programId,
    );

  if (existingRegistration) {
    throw new Error(
      "Applicant sudah terdaftar pada program ini",
    );
  }

  return createRegistration({
    applicantId: applicant.id,
    programId: data.programId,
    status: "DRAFT",
  });
};

export const getAllRegistrationsService = async () => {
  return findAllRegistrations();
};

export const getRegistrationByIdService = async (
  id: number,
) => {
  const registration = await findRegistrationById(id);

  if (!registration) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  return registration;
};

export const getMyRegistrationsService = async (
  userId: number,
) => {
  return findRegistrationsByUserId(userId);
};

export const getRegistrationByIdForUserService = async (
  id: number,
  userId: number,
) => {
  const registration =
    await findRegistrationByIdAndUserId(
      id,
      userId,
    );

  if (!registration) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  return registration;
};

export const submitRegistrationForUserService = async (
  id: number,
  userId: number,
) => {
  const registration =
    await findRegistrationByIdAndUserId(
      id,
      userId,
    );

  if (!registration) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  if (registration.status !== "DRAFT") {
    throw new Error(
      "Pendaftaran hanya dapat disubmit dari status DRAFT",
    );
  }

  return updateRegistration(id, {
    status: "SUBMITTED",
    submittedAt: new Date(),
  });
};

export const submitRegistrationService = async (
  id: number,
) => {
  const registration = await findRegistrationById(id);

  if (!registration) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  if (registration.status !== "DRAFT") {
    throw new Error(
      "Pendaftaran hanya dapat disubmit dari status DRAFT",
    );
  }

  return updateRegistration(id, {
    status: "SUBMITTED",
    submittedAt: new Date(),
  });
};

export const deleteRegistrationForUserService = async (
  id: number,
  userId: number,
) => {
  const registration =
    await findRegistrationByIdAndUserId(
      id,
      userId,
    );

  if (!registration) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  if (registration.status !== "DRAFT") {
    throw new Error(
      "Pendaftaran yang sudah disubmit tidak dapat dihapus",
    );
  }

  await deleteRegistration(id);

  return true;
};

export const deleteRegistrationService = async (
  id: number,
) => {
  const registration = await findRegistrationById(id);

  if (!registration) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  await deleteRegistration(id);

  return true;
};

export const checkRegistrationAccessService =
  async (
    registrationId: number,
    userId: number,
  ) => {
    const registration =
      await checkRegistrationAccess(
        registrationId,
        userId,
      );

    return Boolean(registration);
  };