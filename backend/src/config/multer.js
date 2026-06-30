import multer from "multer";
import { AppError } from "../errors/AppError.js";

export const multerConfig = {
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter(req, file, callback) {
		const allowedMimes = ["image/jpeg", "image/png", "image/webp"];

		if (allowedMimes.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(new AppError("Tipo de arquivo não permitido", 400));
		}
	},
};
