import { Router } from "express";
import relatorioController from "../controllers/relatorio.controller.js";

const relatorioRoutes = Router();

relatorioRoutes.get("/vendas-mensais", relatorioController.vendasMensais);
relatorioRoutes.get("/inventario-estoque", relatorioController.inventarioEstoque);
relatorioRoutes.get("/desempenho-vendedores", relatorioController.desempenhoVendedores);
relatorioRoutes.get("/movimentacao-estoque", relatorioController.movimentacaoEstoque);

export { relatorioRoutes };
