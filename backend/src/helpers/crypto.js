import crypto from "node:crypto";

export function hashToken(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRecoverToken() {
	const token = crypto.randomBytes(32).toString("hex");

	const tokenHash = hashToken(token);

	return { token, tokenHash };
}
