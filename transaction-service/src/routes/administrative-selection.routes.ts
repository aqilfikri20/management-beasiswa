import { Router } from "express";

import {
  createAdministrativeSelectionController,
  getAdministrativeSelectionController,
  getAllAdministrativeSelectionsController,
  updateAdministrativeSelectionController,
} from "../controllers/administrative-selection.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
const router = Router();

router.post(
  "/registrations/:registrationId/administrative-selection",
  authenticate,
  authorize("registration:verify"),
  createAdministrativeSelectionController,
);

router.get(
  "/registrations/:registrationId/administrative-selection",
  authenticate,
  authorize("registration:verify"),
  getAdministrativeSelectionController,
);

router.get(
  "/administrative-selections",
  authenticate,
  authorize("registration:verify"),
  getAllAdministrativeSelectionsController,
);

router.patch(
  "/registrations/:registrationId/administrative-selection",
  authenticate,
  authorize("registration:verify"),
  updateAdministrativeSelectionController,
);

export default router;
