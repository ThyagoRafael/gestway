import { Prisma } from "@prisma/client";
import z from "zod";

const monthlyTargetSchema = z
	.string()
	.regex(/^\d{1,8}(\.\d{1,2})?$/, "Preço inválido")
	.transform((value) => new Prisma.Decimal(value))
	.refine((value) => value.gt(0), "A meta mensal deve ser maior que 0");

const commissionRateSchema = z
	.string()
	.regex(/^\d{1,3}(\.\d{1,2})?$/, "Preço inválido")
	.transform((value) => new Prisma.Decimal(value))
	.refine((value) => value.gt(0) && value.lt(100), "A taxa de comissão deve estar entre 0 e 100");

const vendedorBaseSchema = z.object({
	name: z.string().min(3, "Digite um nome válido"),
	email: z.email("Digite um email válido"),
	monthlyTarget: monthlyTargetSchema,
	commissionRate: commissionRateSchema,
});

export const createVendedorSchema = vendedorBaseSchema;

export const updateVendedorSchema = vendedorBaseSchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, "Informe pelo menos um campo para atualização");
