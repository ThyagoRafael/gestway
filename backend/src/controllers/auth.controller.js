import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { encryptPassword, verifyPassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";
import { loginUserSchema, registerUserSchema } from "../validations/user.validation.js";

class AuthController {
	async registerUser(req, res) {
		const bodyData = registerUserSchema.parse(req.body);

		const passwordHash = await encryptPassword(bodyData.password);

		await prisma.user.create({
			data: {
				fullName: bodyData.fullName,
				email: bodyData.email,
				phoneNumber: bodyData.phoneNumber,
				passwordHash,
			},
		});

		res.status(201).json({ email: bodyData.email });
	}

	async login(req, res) {
		const bodyData = loginUserSchema.parse(req.body);

		const user = await prisma.user.findFirst({
			where: {
				email: bodyData.email,
			},
		});

		if (!user) {
			throw new AppError("Usuário não cadastrado", 404);
		}

		if (!(await verifyPassword(bodyData.password, user.passwordHash))) {
			throw new AppError("A senha está incorreta", 400);
		}

		const token = generateToken(user.id, user.role);

		res.status(200).json({ user: { fullName: user.fullName, email: user.email }, token });
	}
}

export default new AuthController();
