import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  updateUser,
} from "../repositories/user.repository.js";

import { hashPassword } from "../utils/password.js";

import type {
  CreateUserInput,
  UpdateUserInput,
} from "../validators/user.validator.js";

export const getUsers = async () => {
  return findAllUsers();
};

export const getUserById = async (id: number) => {
  const user = await findUserById(id);

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  return user;
};

export const createNewUser = async (
  input: CreateUserInput,
) => {
  const existingEmail = await findUserByEmail(
    input.email,
  );

  if (existingEmail) {
    throw new Error("Email sudah digunakan");
  }

  const existingUsername = await findUserByUsername(
    input.username,
  );

  if (existingUsername) {
    throw new Error("Username sudah digunakan");
  }

  const passwordHash = await hashPassword(
    input.password,
  );

  return createUser({
    username: input.username,
    email: input.email,
    passwordHash,
    fullName: input.fullName,
    roleId: input.roleId,
  });
};

export const updateExistingUser = async (
  id: number,
  input: UpdateUserInput,
) => {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new Error("User tidak ditemukan");
  }

  if (input.email) {
    const emailUser = await findUserByEmail(
      input.email,
    );

    if (emailUser && emailUser.id !== id) {
      throw new Error("Email sudah digunakan");
    }
  }

  if (input.username) {
    const usernameUser =
      await findUserByUsername(input.username);

    if (usernameUser && usernameUser.id !== id) {
      throw new Error("Username sudah digunakan");
    }
  }

  const updateData = Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined,
    ),
  );

  return updateUser(id, updateData);
};

export const deleteExistingUser = async (
  id: number,
) => {
  const existingUser = await findUserById(id);

  if (!existingUser) {
    throw new Error("User tidak ditemukan");
  }

  await deleteUser(id);
};