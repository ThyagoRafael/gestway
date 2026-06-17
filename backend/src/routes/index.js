import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { categoriaRoutes } from "./categoria.routes.js";
import { produtoRoutes } from "./produto.routes.js";
import { voucherRoutes } from "./voucher.routes.js";
import { vendedorRoutes } from "./vendedor.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/categorias", categoriaRoutes);
routes.use("/produtos", produtoRoutes);
routes.use("/vouchers", voucherRoutes);
routes.use("/vendedores", vendedorRoutes);

export { routes };
