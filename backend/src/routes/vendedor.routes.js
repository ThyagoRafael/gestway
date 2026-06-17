import { Router } from "express";
import vendedorController from "../controllers/vendedor.controller";

const vendedorRoutes = Router();

vendedorRoutes.post("/", vendedorController.create);

export { vendedorRoutes };
