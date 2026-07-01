import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const dashboardRoutes = Router();

dashboardRoutes.get("/", authMiddleware, adminMiddleware, dashboardController.dashboard.bind(dashboardController));

export { dashboardRoutes };
