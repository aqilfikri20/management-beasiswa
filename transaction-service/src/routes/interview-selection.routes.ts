import { Router } from "express";

import {
  createInterviewSelectionController,
  getInterviewSelectionController,
  getAllInterviewSelectionsController,
  updateInterviewSelectionController,
} from "../controllers/interview-selection.controller.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post(
  "/registrations/:registrationId/interview-selection",
  authenticate,
  authorize("interview_selection:create"),
  createInterviewSelectionController,
);

router.get(
  "/registrations/:registrationId/interview-selection",
  authenticate,
  authorize("interview_selection:read"),
  getInterviewSelectionController,
);

router.get(
  "/interview-selections",
  authenticate,
  authorize("interview_selection:read"),
  getAllInterviewSelectionsController,
);

router.patch(
  "/registrations/:registrationId/interview-selection",
  authenticate,
  authorize("interview_selection:update"),
  updateInterviewSelectionController,
);

export default router;