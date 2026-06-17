import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { categoriaRoutes } from "./categoria.routes.js";
import { produtoRoutes } from "./produto.routes.js";
import { voucherRoutes } from "./voucher.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/categorias", categoriaRoutes);
routes.use("/produtos", produtoRoutes);
routes.use("/vouchers", voucherRoutes);

export { routes };
