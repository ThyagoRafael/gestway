import z from "zod";

export const updateCategoriaSchema = z
	.object({
		name: z.string().min(3).optional(),
		description: z.string().min(10).optional(),
	})
	.refine((data) => data.name !== undefined || data.description !== undefined, {
		message: "Informe pelo menos um campo para atualização",
	});
