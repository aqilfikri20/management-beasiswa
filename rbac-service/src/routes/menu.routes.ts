import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

import {
  createMenuController,
  deleteMenuController,
  getMenuByIdController,
  getMenusController,
  updateMenuController,
} from "../controllers/menu.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("menu:read"),
  getMenusController,
);

router.get(
  "/:id",
  authorize("menu:read"),
  getMenuByIdController,
);

router.post(
  "/",
  authorize("menu:create"),
  createMenuController,
);

router.patch(
  "/:id",
  authorize("menu:update"),
  updateMenuController,
);

router.delete(
  "/:id",
  authorize("menu:delete"),
  deleteMenuController,
);

export default router;