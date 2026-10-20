import { Router } from "express";

import {
  createSelectionResultController,
  getSelectionResultController,
  getAllSelectionResultsController,
  updateSelectionResultController,
} from "../controllers/selection-result.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
const router = Router();

router.post(
  "/registrations/:registrationId/selection-result",
  authenticate,
  authorize("selection_result:create"),
  createSelectionResultController,
);

router.get(
  "/registrations/:registrationId/selection-result",
  authenticate,
  authorize("selection_result:read"),
  getSelectionResultController,
);

router.get(
  "/selection-results",
  authenticate,
  authorize("selection_result:read"),
  getAllSelectionResultsController,
);

router.patch(
  "/registrations/:registrationId/selection-result",
  authenticate,
  authorize("selection_result:update"),
  updateSelectionResultController,
);

export default router;