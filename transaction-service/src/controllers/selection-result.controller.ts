import type { Request, Response } from "express";

import {
  createSelectionResultService,
  getSelectionResultService,
  getAllSelectionResultsService,
  updateSelectionResultService,
} from "../services/selection-result.service.js";

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

export const createSelectionResultController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const result =
        await createSelectionResultService(
          registrationId,
          req.body,
        );

      return res.status(201).json({
        message:
          "Hasil seleksi berhasil dibuat",
        data: result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat hasil seleksi";

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

export const getSelectionResultController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const result =
        await getSelectionResultService(
          registrationId,
        );

      if (!result) {
        return res.status(404).json({
          message:
            "Hasil seleksi tidak ditemukan",
        });
      }

      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil hasil seleksi";

      return res.status(400).json({
        message,
      });
    }
  };

export const getAllSelectionResultsController =
  async (_req: Request, res: Response) => {
    try {
      const results =
        await getAllSelectionResultsService();

      return res.status(200).json({
        data: results,
      });
    } catch (error) {
      console.error(
        "GET /selection-results error:",
        error,
      );

      return res.status(500).json({
        message:
          "Gagal mengambil data hasil seleksi",
      });
    }
  };

export const updateSelectionResultController =
  async (req: Request, res: Response) => {
    try {
      const registrationId = getRegistrationId(req);

      validateRegistrationId(registrationId);

      const existing =
        await getSelectionResultService(
          registrationId,
        );

      if (!existing) {
        return res.status(404).json({
          message:
            "Hasil seleksi tidak ditemukan",
        });
      }

      const result =
        await updateSelectionResultService(
          registrationId,
          req.body,
        );

      return res.status(200).json({
        message:
          "Hasil seleksi berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui hasil seleksi";

      return res.status(400).json({
        message,
      });
    }
  };