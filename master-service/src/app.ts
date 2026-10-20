import express from "express";
import cors from "cors";
import helmet from "helmet";
import programRoutes from "./routes/program.routes.js";
import requirementRoutes from "./routes/requirement.routes.js";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());
app.use("/programs", programRoutes);
app.use(requirementRoutes);
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "master-service",
    timestamp: new Date().toISOString(),
  });
});

export default app;