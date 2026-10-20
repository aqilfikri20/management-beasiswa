export interface CreateInterviewSelectionInput {
  status: string;
  scheduledAt?: Date;
  score?: number;
  notes?: string;
}

export interface UpdateInterviewSelectionInput {
  status?: string;
  scheduledAt?: Date;
  score?: number;
  notes?: string;
}

const validStatuses: string[] = [
  "SCHEDULED",
  "PASSED",
  "FAILED",
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

const validateDate = (value: unknown): Date => {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      "scheduledAt harus berupa tanggal yang valid",
    );
  }

  return new Date(value);
};

export const validateCreateInterviewSelection = (
  input: unknown,
): CreateInterviewSelectionInput => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Data seleksi wawancara tidak valid",
    );
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.status !== "string" ||
    !validStatuses.includes(data.status)
  ) {
    throw new Error(
      "Status harus SCHEDULED, PASSED, atau FAILED",
    );
  }

  const result: CreateInterviewSelectionInput = {
    status: data.status,
  };

  if (data.scheduledAt !== undefined) {
    result.scheduledAt = validateDate(
      data.scheduledAt,
    );
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

export const validateUpdateInterviewSelection = (
  input: unknown,
): UpdateInterviewSelectionInput => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Data seleksi wawancara tidak valid",
    );
  }

  const data = input as Record<string, unknown>;

  const result: UpdateInterviewSelectionInput = {};

  if (data.status !== undefined) {
    if (
      typeof data.status !== "string" ||
      !validStatuses.includes(data.status)
    ) {
      throw new Error(
        "Status harus SCHEDULED, PASSED, atau FAILED",
      );
    }

    result.status = data.status;
  }

  if (data.scheduledAt !== undefined) {
    result.scheduledAt = validateDate(
      data.scheduledAt,
    );
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