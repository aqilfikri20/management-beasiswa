export interface CreateRequirementInput {
  name: string;
  description?: string;
  isRequired?: boolean;
  allowedFileTypes?: string;
  maxFileSize?: number;
  sortOrder?: number;
}

export interface UpdateRequirementInput {
  name?: string;
  description?: string;
  isRequired?: boolean;
  allowedFileTypes?: string;
  maxFileSize?: number;
  sortOrder?: number;
}

export const validateCreateRequirement = (
  input: unknown,
): CreateRequirementInput => {
  if (!input || typeof input !== "object") {
    throw new Error("Data requirement tidak valid");
  }

  const data = input as Record<string, unknown>;

  if (typeof data.name !== "string" || !data.name.trim()) {
    throw new Error("Name wajib diisi");
  }

  if (
    data.description !== undefined &&
    typeof data.description !== "string"
  ) {
    throw new Error("Description tidak valid");
  }

  if (
    data.isRequired !== undefined &&
    typeof data.isRequired !== "boolean"
  ) {
    throw new Error("isRequired harus berupa boolean");
  }

  if (
    data.allowedFileTypes !== undefined &&
    typeof data.allowedFileTypes !== "string"
  ) {
    throw new Error("allowedFileTypes tidak valid");
  }

  if (
    data.maxFileSize !== undefined &&
    (
      typeof data.maxFileSize !== "number" ||
      !Number.isInteger(data.maxFileSize) ||
      data.maxFileSize <= 0
    )
  ) {
    throw new Error(
      "maxFileSize harus berupa bilangan bulat lebih dari 0",
    );
  }

  if (
    data.sortOrder !== undefined &&
    (
      typeof data.sortOrder !== "number" ||
      !Number.isInteger(data.sortOrder) ||
      data.sortOrder < 0
    )
  ) {
    throw new Error(
      "sortOrder harus berupa bilangan bulat 0 atau lebih",
    );
  }

  const result: CreateRequirementInput = {
    name: data.name.trim(),
  };

  if (data.description !== undefined) {
    result.description = data.description;
  }

  if (data.isRequired !== undefined) {
    result.isRequired = data.isRequired;
  }

  if (data.allowedFileTypes !== undefined) {
    result.allowedFileTypes = data.allowedFileTypes;
  }

  if (data.maxFileSize !== undefined) {
    result.maxFileSize = data.maxFileSize;
  }

  if (data.sortOrder !== undefined) {
    result.sortOrder = data.sortOrder;
  }

  return result;
};

export const validateUpdateRequirement = (
  input: unknown,
): UpdateRequirementInput => {
  if (!input || typeof input !== "object") {
    throw new Error("Data requirement tidak valid");
  }

  const data = input as Record<string, unknown>;

  const result: UpdateRequirementInput = {};

  if (data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      throw new Error("Name tidak valid");
    }

    result.name = data.name.trim();
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      throw new Error("Description tidak valid");
    }

    result.description = data.description;
  }

  if (data.isRequired !== undefined) {
    if (typeof data.isRequired !== "boolean") {
      throw new Error("isRequired harus berupa boolean");
    }

    result.isRequired = data.isRequired;
  }

  if (data.allowedFileTypes !== undefined) {
    if (typeof data.allowedFileTypes !== "string") {
      throw new Error("allowedFileTypes tidak valid");
    }

    result.allowedFileTypes = data.allowedFileTypes;
  }

  if (data.maxFileSize !== undefined) {
    if (
      typeof data.maxFileSize !== "number" ||
      !Number.isInteger(data.maxFileSize) ||
      data.maxFileSize <= 0
    ) {
      throw new Error(
        "maxFileSize harus berupa bilangan bulat lebih dari 0",
      );
    }

    result.maxFileSize = data.maxFileSize;
  }

  if (data.sortOrder !== undefined) {
    if (
      typeof data.sortOrder !== "number" ||
      !Number.isInteger(data.sortOrder) ||
      data.sortOrder < 0
    ) {
      throw new Error(
        "sortOrder harus berupa bilangan bulat 0 atau lebih",
      );
    }

    result.sortOrder = data.sortOrder;
  }

  return result;
};