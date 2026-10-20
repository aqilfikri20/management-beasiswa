import crypto from "node:crypto";

export const generateUsername = (): string => {
  return `PST${crypto.randomBytes(4).toString("hex")}`;
};

export const generateTemporaryPassword = (): string => {
  return crypto.randomBytes(6).toString("base64url");
};