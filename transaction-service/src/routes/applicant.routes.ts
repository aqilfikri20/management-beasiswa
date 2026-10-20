import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createMe,
  getMe,
  updateMe,
} from "../controllers/applicant.controller.js";

const router = Router();

router.get("/me", authenticate, getMe);
router.post("/me", authenticate, createMe);
router.patch("/me", authenticate, updateMe);

export default router;