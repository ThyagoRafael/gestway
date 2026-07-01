import { Router } from "express";
import vendedorController from "../controllers/vendedor.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const vendedorRoutes = Router();

vendedorRoutes.post(
	"/",
	authMiddleware,
	adminMiddleware,
	uploadMiddleware.single("vendedorImage"),
	vendedorController.create,
);
vendedorRoutes.get("/", authMiddleware, adminMiddleware, vendedorController.list);
vendedorRoutes.patch(
	"/:vendedorId",
	authMiddleware,
	adminMiddleware,
	uploadMiddleware.single("vendedorImage"),
	vendedorController.update,
);

export { vendedorRoutes };
