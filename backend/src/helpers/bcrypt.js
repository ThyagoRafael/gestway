import bcrypt from "bcrypt";

export async function encryptPassword(password) {
	const passwordHash = await bcrypt.hash(password, 12);

	return passwordHash;
}

export async function verifyPassword(password, passwordHash) {
	return bcrypt.compare(password, passwordHash);
}
