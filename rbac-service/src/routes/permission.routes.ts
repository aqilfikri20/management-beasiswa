import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

import {
  createPermissionController,
  deletePermissionController,
  getPermissionByIdController,
  getPermissionsController,
  updatePermissionController,
} from "../controllers/permission.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("permission:read"),
  getPermissionsController,
);

router.get(
  "/:id",
  authorize("permission:read"),
  getPermissionByIdController,
);

router.post(
  "/",
  authorize("permission:create"),
  createPermissionController,
);

router.patch(
  "/:id",
  authorize("permission:update"),
  updatePermissionController,
);

router.delete(
  "/:id",
  authorize("permission:delete"),
  deletePermissionController,
);

export default router;