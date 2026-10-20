import type { Request, Response } from "express";

import {
  createRequirementService,
  getRequirementsByProgramIdService,
  getRequirementByIdService,
  updateRequirementService,
  deleteRequirementService,
} from "../services/requirement.service.js";

export const createRequirementController = async (
  req: Request,
  res: Response,
) => {
  try {
    const programId = Number(req.params.programId);

    if (!Number.isInteger(programId) || programId <= 0) {
      return res.status(400).json({
        message: "ID program tidak valid",
      });
    }

    const requirement = await createRequirementService(
      programId,
      req.body,
    );

    return res.status(201).json({
      message: "Requirement berhasil dibuat",
      data: requirement,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal membuat requirement";

    if (message === "Program tidak ditemukan") {
      return res.status(404).json({
        message,
      });
    }

    return res.status(400).json({
      message,
    });
  }
};

export const getRequirementsByProgramIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const programId = Number(req.params.programId);

    if (!Number.isInteger(programId) || programId <= 0) {
      return res.status(400).json({
        message: "ID program tidak valid",
      });
    }

    const requirements =
      await getRequirementsByProgramIdService(programId);

    return res.status(200).json({
      data: requirements,
    });
  } catch {
    return res.status(500).json({
      message: "Gagal mengambil requirement",
    });
  }
};

export const getRequirementByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID requirement tidak valid",
      });
    }

    const requirement =
      await getRequirementByIdService(id);

    if (!requirement) {
      return res.status(404).json({
        message: "Requirement tidak ditemukan",
      });
    }

    return res.status(200).json({
      data: requirement,
    });
  } catch {
    return res.status(500).json({
      message: "Gagal mengambil requirement",
    });
  }
};

export const updateRequirementController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID requirement tidak valid",
      });
    }

    const existingRequirement =
      await getRequirementByIdService(id);

    if (!existingRequirement) {
      return res.status(404).json({
        message: "Requirement tidak ditemukan",
      });
    }

    const requirement =
      await updateRequirementService(id, req.body);

    return res.status(200).json({
      message: "Requirement berhasil diperbarui",
      data: requirement,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui requirement",
    });
  }
};

export const deleteRequirementController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID requirement tidak valid",
      });
    }

    const existingRequirement =
      await getRequirementByIdService(id);

    if (!existingRequirement) {
      return res.status(404).json({
        message: "Requirement tidak ditemukan",
      });
    }

    await deleteRequirementService(id);

    return res.status(200).json({
      message: "Requirement berhasil dihapus",
    });
  } catch {
    return res.status(500).json({
      message: "Gagal menghapus requirement",
    });
  }
};