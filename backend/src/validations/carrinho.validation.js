import z from "zod";

export const createCarrinhoItemSchema = z.object({
	idProduto: z
		.number({ required_error: "idProduto é obrigatório" })
		.int()
		.positive("idProduto deve ser um inteiro positivo"),
	quantidade: z
		.number({ required_error: "quantidade é obrigatória" })
		.int()
		.min(1, "quantidade mínima é 1"),
});

export const updateCarrinhoItemSchema = z.object({
	quantidade: z
		.number({ required_error: "quantidade é obrigatória" })
		.int()
		.min(0, "quantidade não pode ser negativa"),
});
