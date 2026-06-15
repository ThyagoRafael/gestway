import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { categoriaRoutes } from "./categoria.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/categorias", categoriaRoutes);

export { routes };
