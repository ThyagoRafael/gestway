import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { encryptPassword, verifyPassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";
import {
	loginUserSchema,
	requestPasswordSchema,
	registerUserSchema,
	resetPasswordSchema,
} from "../validations/auth.validation.js";
import { sendEmail } from "../helpers/email.js";
import { generateRecoverToken, hashToken } from "../helpers/crypto.js";

class AuthController {
	async registerUser(req, res) {
		const bodyData = registerUserSchema.parse(req.body);

		const emailExists = await prisma.usuario.findUnique({
			where: {
				email_usuario: bodyData.email,
			},
		});

		if (emailExists) {
			throw new AppError("Email já cadastrado", 400);
		}

		const passwordHash = await encryptPassword(bodyData.password);

		await prisma.usuario.create({
			data: {
				nome_completo_usuario: bodyData.fullName,
				email_usuario: bodyData.email,
				senha_hash_usuario: passwordHash,
				telefone_usuario: bodyData.phoneNumber,
			},
		});

		res.status(201).json({ email: bodyData.email });
	}

	async login(req, res) {
		const bodyData = loginUserSchema.parse(req.body);

		const user = await prisma.usuario.findFirst({
			where: {
				email_usuario: bodyData.email,
			},
		});

		if (!user) {
			throw new AppError("Usuário não cadastrado", 404);
		}

		if (!(await verifyPassword(bodyData.password, user.senha_hash_usuario))) {
			throw new AppError("A senha está incorreta", 400);
		}

		const admin = await prisma.administrador.findUnique({
			where: {
				id_usuario: user.id_usuario,
			},
		});

		const token = generateToken(user.id_usuario, !!admin);

		res.status(200).json({ user: { fullName: user.nome_completo_usuario, email: user.email_usuario }, token });
	}

	async requestPasswordReset(req, res) {
		const bodyData = requestPasswordSchema.parse(req.body);

		const user = await prisma.usuario.findUnique({
			where: {
				email_usuario: bodyData.email,
			},
		});

		if (!user) {
			throw new AppError("Email não cadastrado", 404);
		}

		const { token, tokenHash } = generateRecoverToken();

		await prisma.token_recuperacao_senha.create({
			data: {
				usuario_id: user.id_usuario,
				token_hash: tokenHash,
				data_expiracao: new Date(Date.now() + 10 * 60 * 1000),
				utilizado_em: null,
			},
		});

		await sendEmail(
			user.email_usuario,
			`
				<h1>Recuperação de senha</h1>
   				<p>Clique no link abaixo:</p>
				<a href="http://localhost:5173/redefinir-senha?token=${token}">
					Redefinir senha
				</a>
		`,
		);

		res.status(200).json({ message: "Email enviado com sucesso" });
	}

	async resetPassword(req, res) {
		const bodyData = resetPasswordSchema.parse(req.body);
		const tokenHash = hashToken(bodyData.token);
		const now = new Date();
		const newPasswordHash = await encryptPassword(bodyData.password);

		await prisma.$transaction(async (tx) => {
			const tokenData = await tx.token_recuperacao_senha.findFirst({
				where: {
					token_hash: tokenHash,
					utilizado_em: null,
					data_expiracao: {
						gt: now,
					},
				},
			});

			if (!tokenData) {
				throw new AppError("Token inválido ou expirado", 401);
			}

			const consumedToken = await tx.token_recuperacao_senha.updateMany({
				where: {
					id_token: tokenData.id_token,
					utilizado_em: null,
				},
				data: {
					utilizado_em: now,
				},
			});

			if (consumedToken.count === 0) {
				throw new AppError("Token já utilizado", 401);
			}

			await tx.usuario.update({
				where: {
					id_usuario: tokenData.usuario_id,
				},
				data: {
					senha_hash_usuario: newPasswordHash,
				},
			});

			await tx.token_recuperacao_senha.updateMany({
				where: {
					usuario_id: tokenData.usuario_id,
					utilizado_em: null,
				},
				data: {
					utilizado_em: now,
				},
			});
		});

		res.status(200).json({ message: "Senha alterada com sucesso" });
	}
}

export default new AuthController();
