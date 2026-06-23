import { prisma } from "../config/prisma.js";

class DashboardController {
	async dashboard(req, res) {
		const inicioMes = new Date();
		inicioMes.setDate(1);
		inicioMes.setHours(0, 0, 0, 0);

		const [faturamentoMensal, vendasRealizadas, novosClientes, rankingVendedores, rankingProdutos] =
			await Promise.all([
				this.getFaturamentoMensal(inicioMes),
				this.getVendasRealizadas(inicioMes),
				this.getNovosClientes(inicioMes),
				this.getRankingVendedores(inicioMes),
				this.getRankingProdutos(inicioMes),
			]);

		res.status(200).json({
			faturamentoMensal,
			vendasRealizadas,
			novosClientes,
			rankingVendedores,
			rankingProdutos,
		});
	}

	async getFaturamentoMensal(inicioMes) {
		const faturamentoMensal = await prisma.venda.aggregate({
			_sum: {
				total_liquido: true,
			},
			where: {
				criado_em: {
					gte: inicioMes,
				},
				status_pagamento: "APROVADO",
			},
		});

		return faturamentoMensal._sum.total_liquido ?? 0;
	}

	async getVendasRealizadas(inicioMes) {
		return prisma.venda.count({
			where: {
				criado_em: {
					gte: inicioMes,
				},
				status_pagamento: "APROVADO",
			},
		});
	}

	async getNovosClientes(inicioMes) {
		return prisma.cliente.count({
			where: {
				criado_em: {
					gte: inicioMes,
				},
				status_cliente: "ATIVO",
			},
		});
	}

	async getRankingVendedores(inicioMes) {
		const ranking = await prisma.venda.groupBy({
			by: ["id_vendedor"],
			where: {
				criado_em: {
					gte: inicioMes,
				},
			},
			_sum: {
				total_liquido: true,
			},
			orderBy: {
				_sum: {
					total_liquido: "desc",
				},
			},
		});

		const vendedores = await prisma.vendedor.findMany({
			where: {
				id_vendedor: {
					in: ranking.map((item) => item.id_vendedor),
				},
			},
		});

		return ranking.map((item) => {
			const vendedor = vendedores.find((vendedor) => vendedor.id_vendedor === item.id_vendedor);

			return {
				id: item.id_vendedor,
				nome: vendedor?.nome_completo_vendedor,
				faturamento: Number(item._sum.total_liquido ?? 0),
			};
		});
	}

	async getRankingProdutos(inicioMes) {
		const ranking = await prisma.venda_item.groupBy({
			by: ["id_produto"],
			where: {
				criado_em: {
					gte: inicioMes,
				},
			},
			_sum: {
				quantidade: true,
			},
			orderBy: {
				_sum: {
					quantidade: "desc",
				},
			},
		});

		const produtos = await prisma.produto.findMany({
			where: {
				id_produto: {
					in: ranking.map((item) => item.id_produto),
				},
			},
		});

		return ranking.map((item) => {
			const produto = produtos.find((produto) => produto.id_produto === item.id_produto);

			return {
				id: item.id_produto,
				nome: produto?.nome_produto,
				vendas: item._sum.quantidade,
			};
		});
	}
}

export default new DashboardController();
