import type { Request, Response } from "express";

import { scanFileForMalware } from "../services/antivirus.service.js";

export const checkAntivirusController = async (
  _req: Request,
  res: Response,
) => {
  return res.status(200).json({
    message: "ClamAV service tersedia",
  });
};
