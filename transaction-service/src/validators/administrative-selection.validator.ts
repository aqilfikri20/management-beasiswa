export interface CreateAdministrativeSelectionInput {
  status: string;
  score?: number;
  notes?: string;
}

export interface UpdateAdministrativeSelectionInput {
  status?: string;
  score?: number;
  notes?: string;
}

const validStatuses: string[] = [
  "PASSED",
  "FAILED",
  "REVISION",
];

const validateScore = (score: unknown): number => {
  if (
    typeof score !== "number" ||
    !Number.isFinite(score) ||
    score < 0 ||
    score > 100
  ) {
    throw new Error(
      "Score harus berupa angka antara 0 sampai 100",
    );
  }

  return score;
};

export const validateCreateAdministrativeSelection = (
  input: unknown,
): CreateAdministrativeSelectionInput => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Data seleksi administrasi tidak valid",
    );
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.status !== "string" ||
    !validStatuses.includes(data.status)
  ) {
    throw new Error(
      "Status harus PASSED atau FAILED",
    );
  }

  const result: CreateAdministrativeSelectionInput = {
    status: data.status,
  };

  if (data.score !== undefined) {
    result.score = validateScore(data.score);
  }

  if (data.notes !== undefined) {
    if (typeof data.notes !== "string") {
      throw new Error("Notes tidak valid");
    }

    result.notes = data.notes;
  }

  return result;
};

export const validateUpdateAdministrativeSelection = (
  input: unknown,
): UpdateAdministrativeSelectionInput => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Data seleksi administrasi tidak valid",
    );
  }

  const data = input as Record<string, unknown>;

  const result: UpdateAdministrativeSelectionInput = {};

  if (data.status !== undefined) {
    if (
      typeof data.status !== "string" ||
      !validStatuses.includes(data.status)
    ) {
      throw new Error(
        "Status harus PASSED atau FAILED",
      );
    }

    result.status = data.status;
  }

  if (data.score !== undefined) {
    result.score = validateScore(data.score);
  }

  if (data.notes !== undefined) {
    if (typeof data.notes !== "string") {
      throw new Error("Notes tidak valid");
    }

    result.notes = data.notes;
  }

  return result;
};
