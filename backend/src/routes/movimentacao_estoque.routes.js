import { Router } from "express";
import movimentacaoEstoqueController from "../controllers/movimentacao_estoque.controller.js";

const movimentacaoEstoqueRoutes = Router();

movimentacaoEstoqueRoutes.get("/", movimentacaoEstoqueController.list);

export { movimentacaoEstoqueRoutes };
