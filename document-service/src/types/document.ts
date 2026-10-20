export const DOCUMENT_TYPES = [
  "KTP",
  "KK",
  "IJAZAH",
  "REKOMENDASI",
] as const;

export type DocumentType =
  (typeof DOCUMENT_TYPES)[number];

export const ALLOWED_MIME_TYPES = {
  KTP: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
  KK: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
  IJAZAH: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
  REKOMENDASI: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
} as const;

export const MAX_FILE_SIZE =
  2 * 1024 * 1024;