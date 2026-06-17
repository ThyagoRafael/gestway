import { Router } from "express";
import voucherController from "../controllers/voucher.controller.js";

const voucherRoutes = Router();

voucherRoutes.post("/", voucherController.create);
voucherRoutes.get("/", voucherController.list);
voucherRoutes.patch("/:voucherId", voucherController.update);

export { voucherRoutes };
