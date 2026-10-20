export interface CreateRegistrationInput {
  programId: number;
}

export const validateCreateRegistration = (
  input: unknown,
): CreateRegistrationInput => {
  if (!input || typeof input !== "object") {
    throw new Error("Data pendaftaran tidak valid");
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.programId !== "number" ||
    !Number.isInteger(data.programId) ||
    data.programId <= 0
  ) {
    throw new Error("programId tidak valid");
  }

  return {
    programId: data.programId,
  };
};