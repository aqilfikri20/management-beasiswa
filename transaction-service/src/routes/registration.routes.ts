import { Router } from "express";

import {
  createRegistrationController,
  getAllRegistrationsController,
  getRegistrationByIdController,
  submitRegistrationController,
  deleteRegistrationController,
  checkRegistrationAccessController,
  getAdministrativeQueueController,
  getInterviewQueueController,
  getRegistrationStatisticsController,
  getRegistrationReportController,
} from "../controllers/registration.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import {
  internalAuthenticate,
} from "../middlewares/internal-authenticate.js";

const router = Router();

router.get("/registrations/administrative-queue", authenticate, authorize("registration:verify"), getAdministrativeQueueController);
router.get("/registrations/interview-queue", authenticate, authorize("interview_selection:read"), getInterviewQueueController);
router.get("/registrations/statistics", authenticate, authorize("dashboard:read"), getRegistrationStatisticsController);
router.get("/registrations/report", authenticate, authorize("selection_result:read"), getRegistrationReportController);

router.post(
  "/registrations",
  authenticate,
  createRegistrationController,
);

router.get(
  "/registrations",
  authenticate,
  getAllRegistrationsController,
);

router.get(
  "/registrations/:id",
  authenticate,
  getRegistrationByIdController,
);

router.post(
  "/registrations/:id/submit",
  authenticate,
  submitRegistrationController,
);

router.delete(
  "/registrations/:id",
  authenticate,
  deleteRegistrationController,
);

router.get(
  "/internal/registrations/:id/access",
  internalAuthenticate,
  checkRegistrationAccessController,
);

export default router;
