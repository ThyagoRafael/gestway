import { Router } from "express";
import voucherController from "../controllers/voucher.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const voucherRoutes = Router();

voucherRoutes.post("/", authMiddleware, adminMiddleware, voucherController.create);
voucherRoutes.get("/", voucherController.list);
voucherRoutes.patch("/:voucherId", authMiddleware, adminMiddleware, voucherController.update);

export { voucherRoutes };
