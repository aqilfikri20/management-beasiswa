import type { Request, Response } from "express";

import {
  createProgramService,
  getAllProgramsService,
  getProgramByIdService,
  updateProgramService,
  deleteProgramService,
} from "../services/program.service.js";

export const createProgramController = async (
  req: Request,
  res: Response,
) => {
  try {
    const program = await createProgramService(req.body);

    return res.status(201).json({
      message: "Program berhasil dibuat",
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal membuat program",
    });
  }
};

export const getAllProgramsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const programs = await getAllProgramsService();

    return res.status(200).json({
      data: programs,
    });
  } catch (error) {
  if (error instanceof Error) {
    console.error("GET /programs error message:", error.message);
    console.error("GET /programs error stack:", error.stack);
  } else {
    console.error("GET /programs unknown error:", error);
  }

  return res.status(500).json({
    message: "Gagal mengambil data program",
  });
}
};

export const getProgramByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID program tidak valid",
      });
    }

    const program = await getProgramByIdService(id);

    if (!program) {
      return res.status(404).json({
        message: "Program tidak ditemukan",
      });
    }

    return res.status(200).json({
      data: program,
    });
  } catch {
    return res.status(500).json({
      message: "Gagal mengambil program",
    });
  }
};

export const updateProgramController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID program tidak valid",
      });
    }

    const existingProgram = await getProgramByIdService(id);

    if (!existingProgram) {
      return res.status(404).json({
        message: "Program tidak ditemukan",
      });
    }

    const program = await updateProgramService(
      id,
      req.body,
    );

    return res.status(200).json({
      message: "Program berhasil diperbarui",
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui program",
    });
  }
};

export const deleteProgramController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID program tidak valid",
      });
    }

    const existingProgram = await getProgramByIdService(id);

    if (!existingProgram) {
      return res.status(404).json({
        message: "Program tidak ditemukan",
      });
    }

    await deleteProgramService(id);

    return res.status(200).json({
      message: "Program berhasil dihapus",
    });
  } catch {
    return res.status(500).json({
      message: "Gagal menghapus program",
    });
  }
};