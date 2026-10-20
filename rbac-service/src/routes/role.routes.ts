import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

import {
  createRoleController,
  deleteRoleController,
  getRoleByIdController,
  getRolesController,
  updateRoleController,
} from "../controllers/role.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("role:read"),
  getRolesController,
);

router.get(
  "/:id",
  authorize("role:read"),
  getRoleByIdController,
);

router.post(
  "/",
  authorize("role:create"),
  createRoleController,
);

router.patch(
  "/:id",
  authorize("role:update"),
  updateRoleController,
);

router.delete(
  "/:id",
  authorize("role:delete"),
  deleteRoleController,
);

export default router;