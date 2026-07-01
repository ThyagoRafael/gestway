import { Router } from "express";
import produtoController from "../controllers/produto.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const produtoRoutes = Router();

produtoRoutes.post(
	"/",
	authMiddleware,
	adminMiddleware,
	uploadMiddleware.single("produtoImage"),
	produtoController.create,
);
produtoRoutes.get("/", produtoController.list);
produtoRoutes.patch(
	"/:produtoId",
	authMiddleware,
	adminMiddleware,
	uploadMiddleware.single("produtoImage"),
	produtoController.update,
);

export { produtoRoutes };
