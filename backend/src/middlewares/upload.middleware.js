import multer from "multer";
import { multerConfig } from "../config/multer.js";

export const uploadMiddleware = multer(multerConfig);
