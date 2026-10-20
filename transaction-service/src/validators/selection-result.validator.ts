export interface CreateSelectionResultInput {
  result: string;
  finalScore?: number;
  notes?: string;
}

export interface UpdateSelectionResultInput {
  result?: string;
  finalScore?: number;
  notes?: string;
}

const validResults = ["PASSED", "FAILED"];

const validateScore = (score: unknown) => {
  if (
    typeof score !== "number" ||
    Number.isNaN(score) ||
    score < 0 ||
    score > 100
  ) {
    throw new Error(
      "Final score harus berupa angka antara 0 sampai 100",
    );
  }
};

export const validateCreateSelectionResult = (
  input: unknown,
): CreateSelectionResultInput => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Data hasil seleksi tidak valid",
    );
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.result !== "string" ||
    !validResults.includes(data.result)
  ) {
    throw new Error(
      "Result harus PASSED atau FAILED",
    );
  }

  const result: CreateSelectionResultInput = {
    result: data.result,
  };

  if (data.finalScore !== undefined) {
    validateScore(data.finalScore);

    if (typeof data.finalScore !== "number") {
      throw new Error(
        "Final score harus berupa angka antara 0 sampai 100",
      );
    }

    result.finalScore = data.finalScore;
  }

  if (data.notes !== undefined) {
    if (typeof data.notes !== "string") {
      throw new Error("Notes tidak valid");
    }

    result.notes = data.notes;
  }

  return result;
};

export const validateUpdateSelectionResult = (
  input: unknown,
): UpdateSelectionResultInput => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Data hasil seleksi tidak valid",
    );
  }

  const data = input as Record<string, unknown>;

  const result: UpdateSelectionResultInput = {};

  if (data.result !== undefined) {
    if (
      typeof data.result !== "string" ||
      !validResults.includes(data.result)
    ) {
      throw new Error(
        "Result harus PASSED atau FAILED",
      );
    }

    result.result = data.result;
  }

  if (data.finalScore !== undefined) {
    validateScore(data.finalScore);

    if (typeof data.finalScore !== "number") {
      throw new Error(
        "Final score harus berupa angka antara 0 sampai 100",
      );
    }

    result.finalScore = data.finalScore;
  }

  if (data.notes !== undefined) {
    if (typeof data.notes !== "string") {
      throw new Error("Notes tidak valid");
    }

    result.notes = data.notes;
  }

  return result;
};