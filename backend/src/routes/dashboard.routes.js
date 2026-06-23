import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";

const dashboardRoutes = Router();

dashboardRoutes.get("/", dashboardController.dashboard.bind(dashboardController));

export { dashboardRoutes };
