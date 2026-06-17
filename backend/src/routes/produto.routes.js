import { Router } from "express";
import produtoController from "../controllers/produto.controller.js";

const produtoRoutes = Router();

produtoRoutes.post("/", produtoController.create);
produtoRoutes.get("/", produtoController.list);
produtoRoutes.patch("/:produtoId", produtoController.update);

export { produtoRoutes };
