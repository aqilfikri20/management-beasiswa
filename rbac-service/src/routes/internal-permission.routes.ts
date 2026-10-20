import { Router } from "express";

import { internalAuthenticate } from "../middlewares/internal-authenticate.js";

import {
  checkPermissionController,
} from "../controllers/internal-permission.controller.js";

const router = Router();

router.post(
  "/internal/permissions/check",
  internalAuthenticate,
  checkPermissionController,
);

export default router;