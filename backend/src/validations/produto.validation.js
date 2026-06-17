import { Prisma } from "@prisma/client";
import z from "zod";

const precoSchema = z
	.string()
	.regex(/^\d{1,8}(\.\d{1,2})?$/, "Preço inválido")
	.transform((value) => new Prisma.Decimal(value))
	.refine((value) => value.gt(0), "O preço deve ser maior que 0");

export const createProdutoSchema = z.object({
	name: z.string().min(3),
	idCategoria: z.coerce.number().int().positive(),
	price: precoSchema,
	stock: z.coerce.number().int().positive(),
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
		stock: z.coerce.number().int().positive().optional(),
		description: z
			.string()
			.trim()
			.transform((value) => (value === "" ? null : value))
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, "Informe pelo menos um campo para atualização");
