import { Router } from "express";
import vendaController from "../controllers/venda.controller.js";

const vendaRoutes = Router();

vendaRoutes.get("/", vendaController.list);

export { vendaRoutes };
