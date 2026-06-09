import { z } from "zod";

export const registerUserSchema = z.object({
	fullName: z.string().min(3, { error: "Digite seu nome completo" }),
	email: z.email(),
	phoneNumber: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Telefone inválido"),
	password: z
		.string()
		.min(8, "A senha deve ter no mínimo 8 caracteres")
		.max(32, "A senha deve ter no máximo 32 caracteres")
		.regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
		.regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
		.regex(/\d/, "A senha deve conter pelo menos um número")
		.regex(/[!@#$%^&*(),.?":{}|<>]/, "A senha deve conter pelo menos um caractere especial"),
});

export const loginUserSchema = z.object({
	email: z.email(),
	password: z.string(),
});
