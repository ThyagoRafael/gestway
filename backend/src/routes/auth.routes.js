import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", authController.registerUser);
authRoutes.post("/login", authController.login);

authRoutes.post("/forgot-password", authController.requestPasswordReset);
authRoutes.post("/reset-password", authController.resetPassword);

export { authRoutes };
