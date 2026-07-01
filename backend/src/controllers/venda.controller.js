import { prisma } from "../config/prisma.js";

class VendaController {
	async create(req, res) {}

	async list(req, res) {
		const vendas = await prisma.venda.findMany({
			select: {
				numero_pedido: true,
				criado_em: true,
				atualizado_em: true,

				venda_item: {
					select: {
						produto: {
							select: {
								nome_produto: true,
							},
						},
					},
				},
				cliente: {
					select: {
						usuario: {
							select: {
								nome_completo_usuario: true,
							},
						},
					},
				},
				vendedor: {
					select: {
						nome_completo_vendedor: true,
					},
				},
			},
		});

		res.status(200).json(vendas);
	}
}

export default new VendaController();
