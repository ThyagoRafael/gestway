import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export function errorMiddleware(err, req, res, next) {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({ message: err.message });
		return;
	}

	if (err instanceof ZodError) {
		console.log(err);
		const firstError = err.issues[0];

		return res.status(400).json({
			field: firstError.path[0],
			message: firstError.message,
		});
	}

	console.error(err);
	res.status(500).json({ message: "Erro inesperado no servidor" });
}
