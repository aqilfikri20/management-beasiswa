import type { Request, Response } from "express";

import {
  createInterviewSelectionService,
  getInterviewSelectionService,
  getAllInterviewSelectionsService,
  updateInterviewSelectionService,
} from "../services/interview-selection.service.js";

const getRegistrationId = (req: Request): number => {
  return Number(req.params.registrationId);
};

const validateRegistrationId = (
  registrationId: number,
) => {
  if (
    !Number.isInteger(registrationId) ||
    registrationId <= 0
  ) {
    throw new Error("ID pendaftaran tidak valid");
  }
};

const validateAuthenticatedUser = (req: Request) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }

  return req.user.userId;
};

export const createInterviewSelectionController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const userId = validateAuthenticatedUser(req);

      const selection =
        await createInterviewSelectionService(
          registrationId,
          userId,
          req.body,
        );

      return res.status(201).json({
        message:
          "Seleksi wawancara berhasil dibuat",
        data: selection,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat seleksi wawancara";

      if (message === "Unauthorized") {
        return res.status(401).json({
          message,
        });
      }

      if (
        message === "Pendaftaran tidak ditemukan"
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

export const getInterviewSelectionController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const selection =
        await getInterviewSelectionService(
          registrationId,
        );

      if (!selection) {
        return res.status(404).json({
          message:
            "Seleksi wawancara tidak ditemukan",
        });
      }

      return res.status(200).json({
        data: selection,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil seleksi wawancara";

      return res.status(400).json({
        message,
      });
    }
  };

export const getAllInterviewSelectionsController =
  async (_req: Request, res: Response) => {
    try {
      const selections =
        await getAllInterviewSelectionsService();

      return res.status(200).json({
        data: selections,
      });
    } catch (error) {
      console.error(
        "GET /interview-selections error:",
        error,
      );

      return res.status(500).json({
        message:
          "Gagal mengambil data seleksi wawancara",
      });
    }
  };

export const updateInterviewSelectionController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const userId = validateAuthenticatedUser(req);

      const existing =
        await getInterviewSelectionService(
          registrationId,
        );

      if (!existing) {
        return res.status(404).json({
          message:
            "Seleksi wawancara tidak ditemukan",
        });
      }

      const selection =
        await updateInterviewSelectionService(
          registrationId,
          userId,
          req.body,
        );

      return res.status(200).json({
        message:
          "Seleksi wawancara berhasil diperbarui",
        data: selection,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui seleksi wawancara";

      if (message === "Unauthorized") {
        return res.status(401).json({
          message,
        });
      }

      return res.status(400).json({
        message,
      });
    }
  };