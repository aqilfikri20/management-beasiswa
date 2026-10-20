import express from "express";
import cors from "cors";
import helmet from "helmet";
import registrationRoutes from "./routes/registration.routes.js";
import administrativeSelectionRoutes from "./routes/administrative-selection.routes.js";
import interviewSelectionRoutes from "./routes/interview-selection.routes.js";
import selectionResultRoutes from "./routes/selection-result.routes.js";
import applicantRoutes from "./routes/applicant.routes.js";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());
app.use(registrationRoutes);
app.use(administrativeSelectionRoutes);
app.use(interviewSelectionRoutes);
app.use(selectionResultRoutes);
app.use("/applicants", applicantRoutes);
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "transaction-service",
    timestamp: new Date().toISOString(),
  });
});

export default app;