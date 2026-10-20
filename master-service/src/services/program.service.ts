import {
  createProgram,
  findAllPrograms,
  findProgramById,
  updateProgram,
  deleteProgram,
} from "../repositories/program.repository.js";

import {
  validateCreateProgram,
  validateUpdateProgram,
} from "../validators/program.validator.js";

export const createProgramService = async (input: unknown) => {
  const data = validateCreateProgram(input);

  return createProgram({
    title: data.title,
    description: data.description,
    deadline: new Date(data.deadline),
    method: data.method,
    quota: data.quota,
    status: data.status ?? "OPEN",
  });
};

export const getAllProgramsService = async () => {
  return findAllPrograms();
};

export const getProgramByIdService = async (id: number) => {
  return findProgramById(id);
};

export const updateProgramService = async (
  id: number,
  input: unknown,
) => {
  const data = validateUpdateProgram(input);

  const updateData = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined,
    ),
  ) as {
    title?: string;
    description?: string;
    deadline?: Date;
    method?: string;
    quota?: number;
    status?: string;
  };

  if (data.deadline !== undefined) {
    updateData.deadline = new Date(data.deadline);
  }

  return updateProgram(id, updateData);
};

export const deleteProgramService = async (id: number) => {
  return deleteProgram(id);
};