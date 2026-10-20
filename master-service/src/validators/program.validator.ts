export interface CreateProgramInput {
  title: string;
  description: string;
  deadline: string;
  method: string;
  quota: number;
  status?: string;
}

export interface UpdateProgramInput {
  title?: string;
  description?: string;
  deadline?: string;
  method?: string;
  quota?: number;
  status?: string;
}

const validStatuses = ["OPEN", "CLOSED"];

export const validateCreateProgram = (
  input: unknown,
): CreateProgramInput => {
  if (!input || typeof input !== "object") {
    throw new Error("Data program tidak valid");
  }

  const data = input as Record<string, unknown>;

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error("Title wajib diisi");
  }

  if (
    typeof data.description !== "string" ||
    !data.description.trim()
  ) {
    throw new Error("Description wajib diisi");
  }

  if (typeof data.deadline !== "string") {
    throw new Error("Deadline wajib diisi");
  }

  const deadline = new Date(data.deadline);

  if (Number.isNaN(deadline.getTime())) {
    throw new Error("Format deadline tidak valid");
  }

  if (typeof data.method !== "string" || !data.method.trim()) {
    throw new Error("Method wajib diisi");
  }

  if (
    typeof data.quota !== "number" ||
    !Number.isInteger(data.quota) ||
    data.quota <= 0
  ) {
    throw new Error("Quota harus berupa bilangan bulat lebih dari 0");
  }

  if (
    data.status !== undefined &&
    (typeof data.status !== "string" ||
      !validStatuses.includes(data.status))
  ) {
    throw new Error("Status harus OPEN atau CLOSED");
  }

  const result: CreateProgramInput = {
    title: data.title.trim(),
    description: data.description.trim(),
    deadline: data.deadline,
    method: data.method.trim(),
    quota: data.quota,
  };

  if (data.status !== undefined) {
    result.status = data.status;
  }

  return result;
};

export const validateUpdateProgram = (
  input: unknown,
): UpdateProgramInput => {
  if (!input || typeof input !== "object") {
    throw new Error("Data program tidak valid");
  }

  const data = input as Record<string, unknown>;

  const result: UpdateProgramInput = {};

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      throw new Error("Title tidak valid");
    }

    result.title = data.title.trim();
  }

  if (data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      throw new Error("Description tidak valid");
    }

    result.description = data.description.trim();
  }

  if (data.deadline !== undefined) {
    if (typeof data.deadline !== "string") {
      throw new Error("Deadline tidak valid");
    }

    const deadline = new Date(data.deadline);

    if (Number.isNaN(deadline.getTime())) {
      throw new Error("Format deadline tidak valid");
    }

    result.deadline = data.deadline;
  }

  if (data.method !== undefined) {
    if (typeof data.method !== "string" || !data.method.trim()) {
      throw new Error("Method tidak valid");
    }

    result.method = data.method.trim();
  }

  if (data.quota !== undefined) {
    if (
      typeof data.quota !== "number" ||
      !Number.isInteger(data.quota) ||
      data.quota <= 0
    ) {
      throw new Error("Quota harus berupa bilangan bulat lebih dari 0");
    }

    result.quota = data.quota;
  }

  if (data.status !== undefined) {
    if (
      typeof data.status !== "string" ||
      !validStatuses.includes(data.status)
    ) {
      throw new Error("Status harus OPEN atau CLOSED");
    }

    result.status = data.status;
  }

  return result;
};