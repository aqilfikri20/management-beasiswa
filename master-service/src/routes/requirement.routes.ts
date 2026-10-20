import { Router } from "express";

import {
  createRequirementController,
  getRequirementsByProgramIdController,
  getRequirementByIdController,
  updateRequirementController,
  deleteRequirementController,
} from "../controllers/requirement.controller.js";

const router = Router();

router.post(
  "/programs/:programId/requirements",
  createRequirementController,
);

router.get(
  "/programs/:programId/requirements",
  getRequirementsByProgramIdController,
);

router.get(
  "/requirements/:id",
  getRequirementByIdController,
);

router.patch(
  "/requirements/:id",
  updateRequirementController,
);

router.delete(
  "/requirements/:id",
  deleteRequirementController,
);

export default router;