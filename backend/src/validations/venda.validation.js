import { z } from "zod";

export const registerVendaSchema = z.object({
	numeroPedido: z.string(),
	idCarrinho: z.coerce.bigint(),
	voucherCodigo: z.string().optional(),
});
