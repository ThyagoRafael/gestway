import { Router } from "express";
import movimentacaoEstoqueController from "../controllers/movimentacao_estoque.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const movimentacaoEstoqueRoutes = Router();

movimentacaoEstoqueRoutes.get("/", authMiddleware, adminMiddleware, movimentacaoEstoqueController.list);

export { movimentacaoEstoqueRoutes };
