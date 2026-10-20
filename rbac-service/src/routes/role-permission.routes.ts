import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

import {
  getRolePermissionsController,
  updateRolePermissionsController,
} from "../controllers/role-permission.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/roles/:id/permissions",
  authorize("role:update"),
  getRolePermissionsController,
);

router.put(
  "/roles/:id/permissions",
  authorize("role:update"),
  updateRolePermissionsController,
);

export default router;