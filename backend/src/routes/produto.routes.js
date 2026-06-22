import { Router } from "express";
import produtoController from "../controllers/produto.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const produtoRoutes = Router();

produtoRoutes.post("/", authMiddleware, produtoController.create);
produtoRoutes.get("/", produtoController.list);
produtoRoutes.patch("/:produtoId", authMiddleware, produtoController.update);

export { produtoRoutes };
