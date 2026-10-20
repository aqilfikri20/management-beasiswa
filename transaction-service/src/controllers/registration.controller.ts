import type { Request, Response } from "express";

import {
  createRegistrationService,
  getMyRegistrationsService,
  getRegistrationByIdForUserService,
  submitRegistrationForUserService,
  deleteRegistrationForUserService,
  checkRegistrationAccessService,
} from "../services/registration.service.js";
import { findAllRegistrationReports, findStaffRegistrationQueue, getRegistrationStatistics } from "../repositories/registration.repository.js";

export const getRegistrationStatisticsController = async (_req: Request, res: Response) => {
  try { return res.json({ data: await getRegistrationStatistics() }); }
  catch { return res.status(500).json({ message: "Gagal mengambil statistik pendaftaran" }); }
};

export const getRegistrationReportController = async (_req: Request, res: Response) => {
  try { return res.json({ data: await findAllRegistrationReports() }); }
  catch { return res.status(500).json({ message: "Gagal mengambil laporan pendaftaran" }); }
};

export const getAdministrativeQueueController = async (_req: Request, res: Response) => {
  try { return res.json({ data: await findStaffRegistrationQueue(["SUBMITTED", "REVISION_REQUESTED", "ADMIN_PASSED", "ADMIN_FAILED"]) }); }
  catch { return res.status(500).json({ message: "Gagal mengambil antrean verifikasi" }); }
};

export const getInterviewQueueController = async (_req: Request, res: Response) => {
  try { return res.json({ data: await findStaffRegistrationQueue(["ADMIN_PASSED", "INTERVIEW_SCHEDULED", "INTERVIEW_PASSED", "INTERVIEW_FAILED"]) }); }
  catch { return res.status(500).json({ message: "Gagal mengambil antrean wawancara" }); }
};

export const createRegistrationController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const registration =
      await createRegistrationService(
        req.user.userId,
        req.body,
      );

    return res.status(201).json({
      message: "Pendaftaran berhasil dibuat",
      data: registration,
    });
  } catch (error) {
    console.error(
      "POST /registrations error:",
      error,
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat pendaftaran",
    });
  }
};

export const getAllRegistrationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const registrations =
      await getMyRegistrationsService(
        req.user.userId,
      );

    return res.status(200).json({
      data: registrations,
    });
  } catch (error) {
    console.error(
      "GET /registrations error:",
      error,
    );

    return res.status(500).json({
      message:
        "Gagal mengambil data pendaftaran",
    });
  }
};

export const getRegistrationByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID pendaftaran tidak valid",
      });
    }

    const registration =
      await getRegistrationByIdForUserService(
        id,
        req.user.userId,
      );

    return res.status(200).json({
      data: registration,
    });
  } catch (error) {
    console.error(
      "GET /registrations/:id error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengambil pendaftaran";

    if (
      message ===
      "Pendaftaran tidak ditemukan"
    ) {
      return res.status(404).json({
        message,
      });
    }

    return res.status(500).json({
      message,
    });
  }
};

export const submitRegistrationController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID pendaftaran tidak valid",
      });
    }

    const registration =
      await submitRegistrationForUserService(
        id,
        req.user.userId,
      );

    return res.status(200).json({
      message:
        "Pendaftaran berhasil disubmit",
      data: registration,
    });
  } catch (error) {
    console.error(
      "POST /registrations/:id/submit error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal submit pendaftaran";

    if (
      message ===
      "Pendaftaran tidak ditemukan"
    ) {
      return res.status(404).json({
        message,
      });
    }

    return res.status(400).json({
      message,
    });
  }
};

export const deleteRegistrationController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID pendaftaran tidak valid",
      });
    }

    await deleteRegistrationForUserService(
      id,
      req.user.userId,
    );

    return res.status(200).json({
      message:
        "Pendaftaran berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "DELETE /registrations/:id error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal menghapus pendaftaran";

    if (
      message ===
      "Pendaftaran tidak ditemukan"
    ) {
      return res.status(404).json({
        message,
      });
    }

    return res.status(400).json({
      message,
    });
  }
};

export const checkRegistrationAccessController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const registrationId = Number(
        req.params.id,
      );

      const userId = Number(
        req.query.userId,
      );

      if (
        !Number.isInteger(registrationId) ||
        registrationId <= 0
      ) {
        return res.status(400).json({
          message: "registrationId tidak valid",
        });
      }

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          message: "userId tidak valid",
        });
      }

      const allowed =
        await checkRegistrationAccessService(
          registrationId,
          userId,
        );

      return res.status(200).json({
        allowed,
      });
    } catch (error) {
      console.error(
        "Check registration access error:",
        error,
      );

      return res.status(500).json({
        message:
          "Gagal memeriksa akses pendaftaran",
      });
    }
  };
