import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

import {
  getRoleMenusController,
  updateRoleMenusController,
} from "../controllers/role-menu.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/roles/:id/menus",
  authorize("role:update"),
  getRoleMenusController,
);

router.put(
  "/roles/:id/menus",
  authorize("role:update"),
  updateRoleMenusController,
);

export default router;