import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { authenticateGateway } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rate-limit.middleware.js";
import { services } from "../config/services.js";

const router = Router();

const createRbacProxy = () =>
  createProxyMiddleware({
    target: services.rbac,
    changeOrigin: true,
    pathRewrite: (_path, req) =>
      (req as import("express").Request).originalUrl.replace(/^\/api/, ""),
  });

  
router.use(
  "/api/auth/me",
  authenticateGateway,
  createProxyMiddleware({
    target: services.rbac,
    changeOrigin: true,
    pathRewrite: (_path, req) =>
      (req as import("express").Request).originalUrl.replace(/^\/api/, ""),
  }),
);

router.use(
  "/api/auth",
  authRateLimiter,
  createRbacProxy(),
);

router.use(
  "/api/users",
  authenticateGateway,
  createRbacProxy(),
);

router.use(
  "/api/roles",
  authenticateGateway,
  createRbacProxy(),
);

router.use(
  "/api/permissions",
  authenticateGateway,
  createRbacProxy(),
);

router.use(
  "/api/menus",
  authenticateGateway,
  createRbacProxy(),
);

export default router;
