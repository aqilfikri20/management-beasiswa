import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from "../controllers/user.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("user:read"),
  getUsersController,
);

router.get(
  "/:id",
  authorize("user:read"),
  getUserByIdController,
);

router.post(
  "/",
  authorize("user:create"),
  createUserController,
);

router.patch(
  "/:id",
  authorize("user:update"),
  updateUserController,
);

router.delete(
  "/:id",
  authorize("user:delete"),
  deleteUserController,
);

export default router;