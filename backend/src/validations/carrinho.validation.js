import z from "zod";

export const createCarrinhoItemSchema = z.object({
	idProduto: z.number("O id do produto é obrigatório").int().positive("o id do produto deve ser um inteiro positivo"),
	quantidade: z.number("A quantidade é obrigatória").int().min(1, "A quantidade mínima é 1"),
});

export const updateCarrinhoItemSchema = z.object({
	quantidade: z.number("A quantidade é obrigatória").int().min(0, "A quantidade não pode ser negativa"),
});
