import { Router } from "express";
import categoriaController from "../controllers/categoria.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const categoriaRoutes = Router();

categoriaRoutes.use(authMiddleware);
categoriaRoutes.use(adminMiddleware);

categoriaRoutes.post("/", categoriaController.createCategoria);
categoriaRoutes.get("/", categoriaController.listCategoria);
categoriaRoutes.patch("/:categoriaId", categoriaController.updateCategoria);

export { categoriaRoutes };
