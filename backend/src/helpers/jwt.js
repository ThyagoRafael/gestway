import jwt from "jsonwebtoken";

export function generateToken(userId, userRole) {
	const jwtSecret = process.env.JWT_SECRET;

	const token = jwt.sign({ userId, userRole }, jwtSecret, {
		expiresIn: "30m",
	});

	return token;
}
