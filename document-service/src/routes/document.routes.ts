import { Router } from "express";

import {
  uploadDocumentController,
  getDocumentController,
  getDocumentsByRegistrationController,
  getDocumentFileController,
} from "../controllers/document.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../config/upload.js";

const router = Router();

router.post(
  "/documents",
  authenticate,
  upload.single("file"),
  uploadDocumentController,
);
router.get(
  "/documents/:id/file",
  authenticate,
  getDocumentFileController,
);
router.get(
  "/documents/:id",
  authenticate,
  getDocumentController,
);

router.get(
  "/registrations/:registrationId/documents",
  authenticate,
  getDocumentsByRegistrationController,
);


export default router;