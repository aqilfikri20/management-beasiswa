import path from "node:path";

import multer from "multer";

import { MAX_FILE_SIZE } from "../types/document.js";

const tempDirectory = path.resolve(
  process.cwd(),
  "temp",
);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempDirectory);
  },

  filename: (_req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${path.extname(
        file.originalname,
      )}`,
    );
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedMimeTypes.includes(
        file.mimetype,
      )
    ) {
      cb(
        new Error(
          "Format file harus PDF, JPG, JPEG, atau PNG",
        ),
      );

      return;
    }

    cb(null, true);
  },
});