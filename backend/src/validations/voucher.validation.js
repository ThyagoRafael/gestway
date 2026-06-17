import { z } from "zod";

const dateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido. Use YYYY-MM-DD")
	.transform((value) => new Date(`${value}T00:00:00`));

const voucherBaseSchema = z.object({
	code: z.string().min(3).max(45),
	discount: z.coerce.number().int().positive(),
	description: z
		.string()
		.trim()
		.min(3)
		.transform((value) => (value === "" ? null : value))
		.optional(),
	initialDate: dateSchema,
	expirationDate: dateSchema.refine((value) => value > new Date(), "A data de validade deve ser futura"),
});

export const createVoucherSchema = voucherBaseSchema.refine((data) => data.expirationDate > data.initialDate, {
	error: "A data de validade deve ser posterior à data inicial",
	path: ["expirationDate"],
});

export const updateVoucherSchema = voucherBaseSchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, "Informe pelo menos um campo para atualização");
