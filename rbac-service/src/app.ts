import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import rolePermissionRoutes from "./routes/role-permission.routes.js";
import roleMenuRoutes from "./routes/role-menu.routes.js";
import internalPermissionRoutes from "./routes/internal-permission.routes.js";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
    service: "rbac-service",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/menus", menuRoutes);
app.use(internalPermissionRoutes);
app.use(rolePermissionRoutes);
app.use(roleMenuRoutes);
export default app;