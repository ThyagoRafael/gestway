import { Prisma } from "@prisma/client";
import { z } from "zod";

export const registerVendaSchema = z.object({
	numeroPedido: z.string(),
	idCarrinho: z.coerce.bigint(),
	totalBruto: z
		.string()
		.regex(/^\d{1,8}(\.\d{1,2})?$/, "Preço inválido")
		.transform((value) => new Prisma.Decimal(value))
		.refine((value) => value.gt(0), "O preço deve ser maior que 0"),
	voucherCodigo: z.string().optional(),
});
