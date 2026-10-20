import express from "express";
import cors from "cors";
import helmet from "helmet";
import documentRoutes from "./routes/document.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());
app.use(documentRoutes);

app.get("/health", (_req, res) => {
  return res.status(200).json({
    service: "document-service",
    status: "ok",
  });
});

export default app;