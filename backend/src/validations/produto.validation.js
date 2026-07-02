import { Prisma } from "@prisma/client";
import z from "zod";

const precoSchema = z
	.string()
	.regex(/^\d{1,8}(\.\d{1,2})?$/, "Preço inválido")
	.transform((value) => new Prisma.Decimal(value))
	.refine((value) => value.gt(0), "O preço deve ser maior que 0");

// desconto: 0-100, opcional, padrão 0
const descontoSchema = z.coerce
	.number()
	.min(0, "Desconto mínimo é 0%")
	.max(100, "Desconto máximo é 100%")
	.default(0)
	.transform((v) => new Prisma.Decimal(v));

export const createProdutoSchema = z.object({
	name: z.string().min(3),
	idCategoria: z.coerce.number().int().positive(),
	price: precoSchema,
	initialStock: z.coerce.number().int().positive(),
	minStock: z.coerce.number().int().positive(),
	discount: descontoSchema.optional(),
	description: z
		.string()
		.trim()
		.transform((value) => (value === "" ? null : value))
		.optional(),
});

export const updateProdutoSchema = z
	.object({
		name: z.string().min(3).optional(),
		idCategoria: z.coerce.number().int().positive().optional(),
		price: precoSchema.optional(),
		initialStock: z.coerce.number().int().positive().optional(),
		minStock: z.coerce.number().int().positive().optional(),
		discount: descontoSchema.optional(),
		status: z.string().transform(v => v.toUpperCase()).pipe(
			z.enum(["DISPONIVEL", "INDISPONIVEL", "INATIVO", "BAIXO_ESTOQUE"])
		).optional(),
		description: z
			.string()
			.trim()
			.transform((value) => (value === "" ? null : value))
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, "Informe pelo menos um campo para atualização");
