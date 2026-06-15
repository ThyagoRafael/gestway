import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

const jwtSecret = process.env.JWT_SECRET;

export function generateToken(userId, isAdmin) {
	const token = jwt.sign({ userId, isAdmin }, jwtSecret, {
		expiresIn: "30m",
	});

	return token;
}

export function validateToken(token) {
	try {
		const decoded = jwt.verify(token, jwtSecret);

		return decoded;
	} catch (error) {
		console.error(error);
		throw new AppError("Token está expirado", 401);
	}
}
