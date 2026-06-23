import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { categoriaRoutes } from "./categoria.routes.js";
import { produtoRoutes } from "./produto.routes.js";
import { voucherRoutes } from "./voucher.routes.js";
import { vendedorRoutes } from "./vendedor.routes.js";
<<<<<<< HEAD
=======
import { vendaRoutes } from "./venda.routes.js";
import { movimentacaoEstoqueRoutes } from "./movimentacao_estoque.routes.js";
import { dashboardRoutes } from "./dashboard.routes.js";
>>>>>>> e43cb56 (adicionando backend da main)

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/categorias", categoriaRoutes);
routes.use("/produtos", produtoRoutes);
routes.use("/vouchers", voucherRoutes);
routes.use("/vendedores", vendedorRoutes);
<<<<<<< HEAD
=======
routes.use("/vendas", vendaRoutes);
routes.use("/movimentacoes", movimentacaoEstoqueRoutes);
routes.use("/dashboard", dashboardRoutes);
>>>>>>> e43cb56 (adicionando backend da main)

export { routes };
