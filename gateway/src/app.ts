import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";

import { services } from "./config/services.js";
import { authenticateGateway } from "./middlewares/auth.middleware.js";
import { authRateLimiter } from "./middlewares/rate-limit.middleware.js";
import rbacRoutes from "./routes/rbac.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "api-gateway" });
});

app.use(rbacRoutes);

const proxy = (target: string) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (_path, req) =>
      (req as import("express").Request).originalUrl.replace(/^\/api/, ""),
  });

const authenticatedProxy = (target: string) => [authenticateGateway, proxy(target)];

// Programs and their requirements are public to read. Changes require an access token.
app.use(
  "/api/programs",
  (req, res, next) =>
    req.method === "GET" ? next() : authenticateGateway(req, res, next),
  proxy(services.master),
);
app.use(
  "/api/requirements",
  (req, res, next) =>
    req.method === "GET" ? next() : authenticateGateway(req, res, next),
  proxy(services.master),
);

// Document lookup by registration is registered before the transaction proxy.
app.use(
  "/api/registrations/:registrationId/documents",
  ...authenticatedProxy(services.document),
);
app.use("/api/documents", ...authenticatedProxy(services.document));

app.use("/api/applicants", ...authenticatedProxy(services.transaction));
app.use("/api/registrations", ...authenticatedProxy(services.transaction));
app.use("/api/administrative-selections", ...authenticatedProxy(services.transaction));
app.use("/api/interview-selections", ...authenticatedProxy(services.transaction));
app.use("/api/selection-results", ...authenticatedProxy(services.transaction));

app.use(express.json());
app.use((_req, res) => res.status(404).json({ message: "Route API tidak ditemukan" }));

export default app;
