import type { Request, Response } from "express";
import {
  createMyApplicant,
  getMyApplicant,
  updateMyApplicant,
} from "../services/applicant.service.js";

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const applicant = await getMyApplicant(req.user.userId);

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant belum dibuat",
      });
    }

    return res.json({
      data: applicant,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal mengambil data applicant",
    });
  }
};

export const createMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const applicant = await createMyApplicant(
      req.user.userId,
      req.body,
    );

    return res.status(201).json({
      message: "Applicant berhasil dibuat",
      data: applicant,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Gagal membuat applicant";

    return res.status(400).json({
      message,
    });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const applicant = await updateMyApplicant(
      req.user.userId,
      req.body,
    );

    return res.json({
      message: "Applicant berhasil diperbarui",
      data: applicant,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Gagal memperbarui applicant";

    return res.status(400).json({
      message,
    });
  }
};