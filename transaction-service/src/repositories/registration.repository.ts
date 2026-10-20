import { prisma } from "../config/prisma.js";

export const createRegistration = async (data: {
  applicantId: number;
  programId: number;
  status?: string;
}) => {
  return prisma.registration.create({
    data,
  });
};

export const findAllRegistrations = async () => {
  return prisma.registration.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findStaffRegistrationQueue = async (status: string[]) => {
  return prisma.registration.findMany({
    where: { status: { in: status } },
    include: { applicant: true, administrativeSelection: true, interviewSelection: true },
    orderBy: { submittedAt: "desc" },
  });
};

export const getRegistrationStatistics = async () => {
  const [totalRegistrations, pendingAdministrative, revisionRequested, administrativePassed, administrativeFailed, readyForInterview, interviewScheduled, interviewPassed, interviewFailed, finalPassed, finalFailed] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: "SUBMITTED" } }),
    prisma.administrativeSelection.count({ where: { status: "REVISION" } }),
    prisma.administrativeSelection.count({ where: { status: "PASSED" } }),
    prisma.administrativeSelection.count({ where: { status: "FAILED" } }),
    prisma.registration.count({ where: { status: "ADMIN_PASSED" } }),
    prisma.interviewSelection.count({ where: { status: "SCHEDULED" } }),
    prisma.interviewSelection.count({ where: { status: "PASSED" } }),
    prisma.interviewSelection.count({ where: { status: "FAILED" } }),
    prisma.selectionResult.count({ where: { result: "PASSED" } }),
    prisma.selectionResult.count({ where: { result: "FAILED" } }),
  ]);

  return { totalRegistrations, pendingAdministrative, revisionRequested, administrativePassed, administrativeFailed, readyForInterview, interviewScheduled, interviewPassed, interviewFailed, finalPassed, finalFailed };
};

export const findAllRegistrationReports = async () => prisma.registration.findMany({
  include: { applicant: true, administrativeSelection: true, interviewSelection: true, selectionResult: true },
  orderBy: { createdAt: "desc" },
});

export const findRegistrationById = async (id: number) => {
  return prisma.registration.findUnique({
    where: {
      id,
    },
    include: {
      administrativeSelection: true,
      interviewSelection: true,
      selectionResult: true,
    },
  });
};

export const findRegistrationByIdAndUserId = async (
  id: number,
  userId: number,
) => {
  return prisma.registration.findFirst({
    where: {
      id,
      applicant: {
        userId,
      },
    },
    include: {
      administrativeSelection: true,
      interviewSelection: true,
      selectionResult: true,
    },
  });
};

export const findRegistrationByApplicantAndProgram = async (
  applicantId: number,
  programId: number,
) => {
  return prisma.registration.findUnique({
    where: {
      applicantId_programId: {
        applicantId,
        programId,
      },
    },
  });
};

export const updateRegistration = async (
  id: number,
  data: {
    status?: string;
    submittedAt?: Date;
  },
) => {
  return prisma.registration.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteRegistration = async (id: number) => {
  return prisma.registration.delete({
    where: {
      id,
    },
  });
};

export const findRegistrationsByUserId = async (
  userId: number,
) => {
  return prisma.registration.findMany({
    where: {
      applicant: {
        userId,
      },
    },
    include: {
      administrativeSelection: true,
      interviewSelection: true,
      selectionResult: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const checkRegistrationAccess = async (
  registrationId: number,
  userId: number,
) => {
  const registration =
    await prisma.registration.findFirst({
      where: {
        id: registrationId,
        applicant: {
          userId,
        },
      },
      select: {
        id: true,
        applicantId: true,
      },
    });

  return registration;
};
