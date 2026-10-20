import path from "node:path";

const PDF_SIGNATURE = Buffer.from(
  "%PDF-",
);

const JPEG_SIGNATURE = Buffer.from([
  0xff,
  0xd8,
  0xff,
]);

const PNG_SIGNATURE = Buffer.from([
  0x89,
  0x50,
  0x4e,
  0x47,
  0x0d,
  0x0a,
  0x1a,
  0x0a,
]);

export type DetectedFileType =
  | "pdf"
  | "jpg"
  | "png";

export const detectFileType = (
  buffer: Buffer,
): DetectedFileType => {
  if (
    buffer.subarray(
      0,
      PDF_SIGNATURE.length,
    ).equals(PDF_SIGNATURE)
  ) {
    return "pdf";
  }

  if (
    buffer.subarray(
      0,
      JPEG_SIGNATURE.length,
    ).equals(JPEG_SIGNATURE)
  ) {
    return "jpg";
  }

  if (
    buffer.subarray(
      0,
      PNG_SIGNATURE.length,
    ).equals(PNG_SIGNATURE)
  ) {
    return "png";
  }

  throw new Error(
    "File tidak memiliki signature PDF/JPG/PNG yang valid",
  );
};

export const validateFileExtension = (
  originalName: string,
) => {
  const extension = path
    .extname(originalName)
    .toLowerCase();

  const allowedExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  if (!allowedExtensions.includes(extension)) {
    throw new Error(
      "Format file harus PDF, JPG, JPEG, atau PNG",
    );
  }

  return extension;
};

export const validateMimeType = (
  mimeType: string,
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error(
      "MIME type file tidak diizinkan",
    );
  }
};