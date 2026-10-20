import { Router } from "express";

import {
  createProgramController,
  getAllProgramsController,
  getProgramByIdController,
  updateProgramController,
  deleteProgramController,
} from "../controllers/program.controller.js";

const router = Router();

router.post("/", createProgramController);

router.get("/", getAllProgramsController);

router.get("/:id", getProgramByIdController);

router.patch("/:id", updateProgramController);

router.delete("/:id", deleteProgramController);

export default router;