import { Router } from "express";
import vendedorController from "../controllers/vendedor.controller.js";

const vendedorRoutes = Router();

vendedorRoutes.post("/", vendedorController.create);
vendedorRoutes.get("/", vendedorController.list);
vendedorRoutes.patch("/:vendedorId", vendedorController.update);

export { vendedorRoutes };
