import type { Request, Response } from "express";
import {
  uploadDocumentService,
  getDocumentService,
  getDocumentsByRegistrationService,
  getDocumentFileService,
} from "../services/document.service.js";

const getAuthenticatedUser = (req: Request) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }

  return req.user;
};

export const uploadDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    getAuthenticatedUser(req);

    const registrationId = Number(
      req.body.registrationId,
    );

    const documentType = req.body.documentType;

    if (!Number.isInteger(registrationId)) {
      return res.status(400).json({
        message: "registrationId tidak valid",
      });
    }

    if (typeof documentType !== "string") {
      return res.status(400).json({
        message: "documentType wajib diisi",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "File wajib diunggah",
      });
    }

const user = getAuthenticatedUser(req);

const document =
  await uploadDocumentService({
    registrationId,
    userId: user.userId,
    documentType,
    file: req.file,
  });

    return res.status(201).json({
      message: "Dokumen berhasil diunggah",
      data: document,
    });
  } catch (error) {
    console.error("Upload document error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengunggah dokumen";

        if (message === "Unauthorized") {
        return res.status(401).json({
            message,
        });
        }

    if (
    message ===
    "Anda tidak memiliki akses ke pendaftaran ini"
    ) {
    return res.status(403).json({
        message,
    });
    }

    return res.status(400).json({
    message,
    });
  }
};

export const getDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    getAuthenticatedUser(req);

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID dokumen tidak valid",
      });
    }

    const document =
      await getDocumentService(id);

    if (!document) {
      return res.status(404).json({
        message: "Dokumen tidak ditemukan",
      });
    }

    return res.status(200).json({
      data: document,
    });
  } catch (error) {
    console.error("Get document error:", error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export const getDocumentsByRegistrationController =
  async (req: Request, res: Response) => {
    try {
      getAuthenticatedUser(req);

      const registrationId = Number(
        req.params.registrationId,
      );

      if (
        !Number.isInteger(registrationId) ||
        registrationId <= 0
      ) {
        return res.status(400).json({
          message: "registrationId tidak valid",
        });
      }

      const documents =
        await getDocumentsByRegistrationService(
          registrationId,
        );

      return res.status(200).json({
        data: documents,
      });
    } catch (error) {
      console.error(
        "Get registration documents error:",
        error,
      );

      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  };

  export const getDocumentFileController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const user =
        getAuthenticatedUser(req);

      const id = Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          message: "ID dokumen tidak valid",
        });
      }

      const {
        document,
        absolutePath,
      } = await getDocumentFileService(
        id,
        user.userId,
      );

      res.setHeader(
        "Content-Type",
        document.mimeType,
      );

      res.setHeader(
        "Content-Length",
        document.fileSize.toString(),
      );

      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(document.originalName)}"`,
      );

      return res.sendFile(
        absolutePath,
      );
    } catch (error) {
      console.error(
        "Get document file error:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil file dokumen";

      if (message === "Unauthorized") {
        return res.status(401).json({
          message,
        });
      }

      if (
        message ===
          "Dokumen tidak ditemukan" ||
        message ===
          "File dokumen tidak ditemukan di storage"
      ) {
        return res.status(404).json({
          message,
        });
      }

      if (
        message ===
        "Anda tidak memiliki akses ke dokumen ini"
      ) {
        return res.status(403).json({
          message,
        });
      }

      return res.status(400).json({
        message,
      });
    }
  };