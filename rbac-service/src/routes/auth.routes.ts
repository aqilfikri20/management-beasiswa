import { Router } from "express";
import {
  loginController,
  refreshController,
  logoutController,
  meController,
  registerController,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
const router = Router();

router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.post("/register", registerController);
router.get("/me", authenticate, meController);
export default router;