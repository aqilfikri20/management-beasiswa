import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import {
  createDocument,
  findDocumentById,
  findDocumentsByRegistrationId,
} from "../repositories/document.repository.js";

import {
  checkRegistrationAccess,
} from "./authorization.service.js";

import {
  detectFileType,
  validateFileExtension,
  validateMimeType,
} from "../validators/file.validator.js";

import { scanFileForMalware } from "./antivirus.service.js";

import {
  ALLOWED_MIME_TYPES,
  DOCUMENT_TYPES,
  type DocumentType,
} from "../types/document.js";

const storageDirectory = path.resolve(
  process.cwd(),
  "storage",
);

const getExtensionFromDetectedType = (
  detectedType: "pdf" | "jpg" | "png",
) => {
  switch (detectedType) {
    case "pdf":
      return ".pdf";

    case "jpg":
      return ".jpg";

    case "png":
      return ".png";
  }
};

const isDocumentType = (
  value: string,
): value is DocumentType => {
  return DOCUMENT_TYPES.includes(
    value as DocumentType,
  );
};

export const uploadDocumentService = async (input: {
  registrationId: number;
  userId: number;
  documentType: string;
  file: Express.Multer.File;
}) => {
  const {
    registrationId,
    userId,
    documentType,
    file,
  } = input;

  let tempFilePath = file?.path ?? "";
  let destinationPath = "";

  try {
    if (
      !Number.isInteger(registrationId) ||
      registrationId <= 0
    ) {
      throw new Error("registrationId tidak valid");
    }

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error("userId tidak valid");
    }

    if (!isDocumentType(documentType)) {
      throw new Error(
        "documentType harus KTP, KK, IJAZAH, atau REKOMENDASI",
      );
    }

    if (!file) {
      throw new Error("File wajib diunggah");
    }

    const allowed =
      await checkRegistrationAccess(
        registrationId,
        userId,
      );

    if (!allowed) {
      throw new Error(
        "Anda tidak memiliki akses ke pendaftaran ini",
      );
    }

    validateFileExtension(file.originalname);
    validateMimeType(file.mimetype);

    const fileBuffer =
      await fs.readFile(tempFilePath);

    const detectedType =
      detectFileType(fileBuffer);

    const detectedMimeType =
      detectedType === "pdf"
        ? "application/pdf"
        : detectedType === "jpg"
          ? "image/jpeg"
          : "image/png";

    const allowedMimeTypes =
      ALLOWED_MIME_TYPES[documentType];

    if (
      !allowedMimeTypes.includes(
        detectedMimeType as never,
      )
    ) {
      throw new Error(
        "Jenis file tidak sesuai dengan MIME type yang diizinkan",
      );
    }

    if (
      fileBuffer.length >
      2 * 1024 * 1024
    ) {
      throw new Error(
        "Ukuran file maksimal 2 MB",
      );
    }

    await scanFileForMalware(
      tempFilePath,
    );

    const extension =
      getExtensionFromDetectedType(
        detectedType,
      );

    const registrationDirectory =
      path.join(
        storageDirectory,
        `registration-${registrationId}`,
      );

    await fs.mkdir(
      registrationDirectory,
      {
        recursive: true,
      },
    );

    const uuid =
      crypto.randomUUID();

    const storedName =
      `${uuid}${extension}`;

    destinationPath =
      path.join(
        registrationDirectory,
        storedName,
      );

    await fs.rename(
      tempFilePath,
      destinationPath,
    );

    tempFilePath = "";

    const storagePath =
      path.relative(
        storageDirectory,
        destinationPath,
      );

    try {
      const document =
        await createDocument({
          registrationId,
          documentType,
          originalName:
            file.originalname,
          storedName,
          mimeType:
            detectedMimeType,
          fileSize:
            fileBuffer.length,
          storagePath,
          status: "UPLOADED",
        });

      destinationPath = "";

      return document;
    } catch (error) {
      await fs
        .unlink(destinationPath)
        .catch(() => undefined);

      destinationPath = "";

      throw error;
    }
  } catch (error) {
    if (tempFilePath) {
      await fs
        .unlink(tempFilePath)
        .catch(() => undefined);
    }

    if (destinationPath) {
      await fs
        .unlink(destinationPath)
        .catch(() => undefined);
    }

    throw error;
  }
};

export const getDocumentService = async (
  id: number,
) => {
  return findDocumentById(id);
};

export const getDocumentsByRegistrationService =
  async (registrationId: number) => {
    return findDocumentsByRegistrationId(
      registrationId,
    );
  };

export const getDocumentFileService = async (
  id: number,
  userId: number,
) => {
  const document =
    await findDocumentById(id);

  if (!document) {
    throw new Error(
      "Dokumen tidak ditemukan",
    );
  }

  const allowed =
    await checkRegistrationAccess(
      document.registrationId,
      userId,
    );

  if (!allowed) {
    throw new Error(
      "Anda tidak memiliki akses ke dokumen ini",
    );
  }

  const absolutePath =
    path.resolve(
      storageDirectory,
      document.storagePath,
    );

  const storageRoot =
    path.resolve(storageDirectory);

  if (
    !absolutePath.startsWith(
      `${storageRoot}${path.sep}`,
    )
  ) {
    throw new Error(
      "Path dokumen tidak valid",
    );
  }

  try {
    await fs.access(absolutePath);
  } catch {
    throw new Error(
      "File dokumen tidak ditemukan di storage",
    );
  }

  return {
    document,
    absolutePath,
  };
};