import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", authController.registerUser);
authRoutes.post("/login", authController.login);

export { authRoutes };
