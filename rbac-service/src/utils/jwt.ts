import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum dikonfigurasi");
}

export interface AccessTokenPayload {
  userId: number;
  roleId: number;
}

export const generateAccessToken = (
  payload: AccessTokenPayload,
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};