import { Router } from "express";
import categoriaController from "../controllers/categoria.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const categoriaRoutes = Router();

categoriaRoutes.post("/", authMiddleware, adminMiddleware, categoriaController.createCategoria);
categoriaRoutes.get("/", categoriaController.listCategoria);
categoriaRoutes.patch("/:categoriaId", authMiddleware, adminMiddleware, categoriaController.updateCategoria);

export { categoriaRoutes };
