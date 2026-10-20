export interface RegisterApplicantInput {
  fullName: string;
  email: string;
}

export const validateRegisterApplicant = (
  input: unknown,
): RegisterApplicantInput => {
  if (
    typeof input !== "object" ||
    input === null
  ) {
    throw new Error("Data registrasi tidak valid");
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.fullName !== "string" ||
    data.fullName.trim().length < 3
  ) {
    throw new Error(
      "Nama lengkap minimal 3 karakter",
    );
  }

  if (
    typeof data.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      data.email.trim(),
    )
  ) {
    throw new Error("Format email tidak valid");
  }

  return {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
  };
};