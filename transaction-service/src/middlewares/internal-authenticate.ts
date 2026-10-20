import type { NextFunction, Request, Response } from "express";

export const internalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const serviceKey =
    req.headers["x-internal-service-key"];

  const expectedKey =
    process.env.INTERNAL_SERVICE_KEY;

  console.log("DEBUG serviceKey:", serviceKey);
  console.log("DEBUG expectedKey:", expectedKey);
  console.log(
    "DEBUG headers:",
    req.headers,
  );

  if (!expectedKey) {
    console.error(
      "INTERNAL_SERVICE_KEY belum dikonfigurasi",
    );

    return res.status(500).json({
      message:
        "Internal service authentication belum dikonfigurasi",
    });
  }

  if (
    typeof serviceKey !== "string" ||
    serviceKey !== expectedKey
  ) {
    return res.status(401).json({
      message: "Unauthorized internal service",
    });
  }

  next();
};