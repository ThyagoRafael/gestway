import { Router } from "express";
import { authRoutes }               from "./auth.routes.js";
import { categoriaRoutes }          from "./categoria.routes.js";
import { produtoRoutes }            from "./produto.routes.js";
import { voucherRoutes }            from "./voucher.routes.js";
import { vendedorRoutes }           from "./vendedor.routes.js";
import { vendaRoutes }              from "./venda.routes.js";
import { movimentacaoEstoqueRoutes } from "./movimentacao_estoque.routes.js";
import { dashboardRoutes }          from "./dashboard.routes.js";
import { relatorioRoutes }          from "./relatorio.routes.js";
import { carrinhoRoutes }           from "./carrinho.routes.js";

const routes = Router();

routes.use("/auth",          authRoutes);
routes.use("/categorias",    categoriaRoutes);
routes.use("/produtos",      produtoRoutes);
routes.use("/vouchers",      voucherRoutes);
routes.use("/vendedores",    vendedorRoutes);
routes.use("/vendas",        vendaRoutes);
routes.use("/movimentacoes", movimentacaoEstoqueRoutes);
routes.use("/dashboard",     dashboardRoutes);
routes.use("/relatorios",    relatorioRoutes);
routes.use("/carrinho",      carrinhoRoutes);

export { routes };
