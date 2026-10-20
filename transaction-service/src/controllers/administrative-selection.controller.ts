import type { Request, Response } from "express";

import {
  createAdministrativeSelectionService,
  getAdministrativeSelectionService,
  getAllAdministrativeSelectionsService,
  updateAdministrativeSelectionService,
} from "../services/administrative-selection.service.js";

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

export const createAdministrativeSelectionController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const userId = validateAuthenticatedUser(req);

      const selection =
        await createAdministrativeSelectionService(
          registrationId,
          userId,
          req.body,
        );

      return res.status(201).json({
        message:
          "Seleksi administrasi berhasil dibuat",
        data: selection,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat seleksi administrasi";

      if (message === "Unauthorized") {
        return res.status(401).json({
          message,
        });
      }

      if (
        message === "Pendaftaran tidak ditemukan" ||
        message ===
          "Seleksi administrasi tidak ditemukan"
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

export const getAdministrativeSelectionController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const selection =
        await getAdministrativeSelectionService(
          registrationId,
        );

      if (!selection) {
        return res.status(404).json({
          message:
            "Seleksi administrasi tidak ditemukan",
        });
      }

      return res.status(200).json({
        data: selection,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil seleksi administrasi";

      return res.status(400).json({
        message,
      });
    }
  };

export const getAllAdministrativeSelectionsController =
  async (_req: Request, res: Response) => {
    try {
      const selections =
        await getAllAdministrativeSelectionsService();

      return res.status(200).json({
        data: selections,
      });
    } catch (error) {
      console.error(
        "GET /administrative-selections error:",
        error,
      );

      return res.status(500).json({
        message:
          "Gagal mengambil data seleksi administrasi",
      });
    }
  };

export const updateAdministrativeSelectionController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const userId = validateAuthenticatedUser(req);

      const existing =
        await getAdministrativeSelectionService(
          registrationId,
        );

      if (!existing) {
        return res.status(404).json({
          message:
            "Seleksi administrasi tidak ditemukan",
        });
      }

      const selection =
        await updateAdministrativeSelectionService(
          registrationId,
          userId,
          req.body,
        );

      return res.status(200).json({
        message:
          "Seleksi administrasi berhasil diperbarui",
        data: selection,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui seleksi administrasi";

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