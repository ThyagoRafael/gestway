import { Router } from "express";
import vendaController from "../controllers/venda.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const vendaRoutes = Router();

vendaRoutes.post("/", authMiddleware, vendaController.create);
vendaRoutes.get("/", authMiddleware, adminMiddleware, vendaController.list);

export { vendaRoutes };
