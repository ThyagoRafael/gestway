import { Router } from "express";
import vendedorController from "../controllers/vendedor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const vendedorRoutes = Router();

vendedorRoutes.post("/", authMiddleware, uploadMiddleware.single("vendedorImage"), vendedorController.create);
vendedorRoutes.get("/", authMiddleware, vendedorController.list);
vendedorRoutes.patch(
	"/:vendedorId",
	authMiddleware,
	uploadMiddleware.single("vendedorImage"),
	vendedorController.update,
);

export { vendedorRoutes };
