import { Router } from "express";
import relatorioController from "../controllers/relatorio.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const relatorioRoutes = Router();

relatorioRoutes.use(authMiddleware);
relatorioRoutes.use(adminMiddleware);

relatorioRoutes.get("/vendas-mensais", relatorioController.vendasMensais);
relatorioRoutes.get("/inventario-estoque", relatorioController.inventarioEstoque);
relatorioRoutes.get("/desempenho-vendedores", relatorioController.desempenhoVendedores);
relatorioRoutes.get("/movimentacao-estoque", relatorioController.movimentacaoEstoque);

export { relatorioRoutes };
