import { AppError } from "../errors/AppError.js";
import { validateToken } from "../helpers/jwt.js";

export async function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new AppError("O token não foi enviado", 401);
	}

	const [, token] = authHeader.split(" ");

	if (!token) {
		throw new AppError("O token está mal formatado", 401);
	}

	const decodedToken = await validateToken(token);

	req.user = decodedToken;

	next();
}

export async function adminMiddleware(req, res, next) {
	if (!req.user.isAdmin) {
		throw new AppError("Acesso negado", 403);
	}

	next();
}
