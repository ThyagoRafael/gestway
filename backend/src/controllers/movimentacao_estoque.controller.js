import { prisma } from "../config/prisma.js";

class MovimentacaoEstoqueController {
	async list(req, res) {
		const movimentacoes = await prisma.movimentacao_estoque.findMany({
			select: {
				id_movimentacao: true,
				data_hora: true,
				tipo_movimentacao: true,
				quantidade: true,
				motivo: true,

				produto: {
					select: {
						nome_produto: true,
					},
				},

				vendedor: {
					select: {
						nome_completo_vendedor: true,
					},
				},
			},
		});

		res.status(200).json(movimentacoes);
	}
}

export default new MovimentacaoEstoqueController();
