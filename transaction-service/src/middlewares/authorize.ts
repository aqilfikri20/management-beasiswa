import type {
  NextFunction,
  Request,
  Response,
} from "express";

export const authorize = (
  requiredPermission: string,
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const rbacServiceUrl =
        process.env.RBAC_SERVICE_URL;

      const internalServiceKey =
        process.env.RBAC_INTERNAL_SERVICE_KEY;

      if (
        !rbacServiceUrl ||
        !internalServiceKey
      ) {
        console.error(
          "RBAC authorization belum dikonfigurasi",
        );

        return res.status(500).json({
          message:
            "Authorization service belum dikonfigurasi",
        });
      }

      const response = await fetch(
        `${rbacServiceUrl}/internal/permissions/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-service-key":
              internalServiceKey,
          },
          body: JSON.stringify({
            roleId: req.user.roleId,
            permission: requiredPermission,
          }),
        },
      );

      if (!response.ok) {
        console.error(
          "RBAC permission check failed:",
          response.status,
        );

        return res.status(500).json({
          message:
            "Gagal memeriksa authorization",
        });
      }

      const result = (await response.json()) as {
        allowed?: boolean;
      };

      if (!result.allowed) {
        return res.status(403).json({
          message:
            "Anda tidak memiliki permission untuk melakukan aksi ini",
        });
      }

      next();
    } catch (error) {
      console.error(
        "Authorization error:",
        error,
      );

      return res.status(500).json({
        message:
          "Gagal memeriksa authorization",
      });
    }
  };
};