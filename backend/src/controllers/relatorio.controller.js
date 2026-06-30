import { prisma } from "../config/prisma.js";

class RelatorioController {
	async vendasMensais(req, res) {
		const inicioMes = new Date();
		inicioMes.setDate(1);
		inicioMes.setHours(0, 0, 0, 0);

		const vendedores = await prisma.vendedor.findMany({
			select: {
				id_vendedor: true,
				nome_completo_vendedor: true,
				venda: {
					where: {
						criado_em: {
							gte: inicioMes,
						},
						status_pagamento: "APROVADO",
					},
					select: {
						total_liquido: true,
						venda_item: {
							select: {
								quantidade: true,
							},
						},
					},
				},
			},
		});

		const dadosRelatorio = vendedores.map((vendedor) => {
			const faturamento = vendedor.venda.reduce((acc, venda) => acc + Number(venda.total_liquido), 0);

			const quantidadeProdutos = vendedor.venda.reduce(
				(acc, venda) => acc + venda.venda_item.reduce((total, item) => total + item.quantidade, 0),
				0,
			);

			return {
				id: vendedor.id_vendedor,
				nome: vendedor.nome_completo_vendedor,
				faturamentoMensal: faturamento,
				quantidadeProdutosVendidos: quantidadeProdutos,
				quantidadeVendas: vendedor.venda.length,
			};
		});

		res.status(200).json(dadosRelatorio);
	}

	async inventarioEstoque(req, res) {
		const produtos = await prisma.produto.findMany({
			select: {
				id_produto: true,
				nome_produto: true,
				estoque_atual_produto: true,
				preco_produto: true,
				categoria: {
					select: {
						nome_categoria: true,
					},
				},
			},
		});

		const dadosRelatorio = produtos.map((produto) => ({
			id: produto.id_produto,
			nome: produto.nome_produto,
			quantidade: produto.estoque_atual_produto,
			valorTotal: produto.preco_produto.mul(produto.estoque_atual_produto),
		}));

		res.status(200).json(dadosRelatorio);
	}

	async desempenhoVendedores(req, res) {
		const vendedores = await prisma.vendedor.findMany({
			select: {
				nome_completo_vendedor: true,
				taxa_comissao_vendedor: true,
				venda: {
					where: {
						status_pagamento: "APROVADO",
					},
					select: {
						total_liquido: true,
					},
				},
			},
		});

		const dadosRelatorio = vendedores.map((vendedor) => {
			const faturamento = vendedor.venda.reduce((acc, venda) => acc + Number(venda.total_liquido), 0);

			const comissao = faturamento * (Number(vendedor.taxa_comissao_vendedor) / 100);

			return {
				nome: vendedor.nome_completo_vendedor,
				quantidadeVendas: vendedor.venda.length,
				faturamento,
				comissao,
			};
		});

		res.status(200).json(dadosRelatorio);
	}

	async movimentacaoEstoque(req, res) {
		const movimentacoes = await prisma.movimentacao_estoque.findMany({
			select: {
				id_movimentacao: true,
				data_hora: true,
				tipo_movimentacao: true,
				quantidade: true,
				vendedor: {
					select: {
						nome_completo_vendedor: true,
					},
				},
				produto: {
					select: {
						nome_produto: true,
					},
				},
			},
		});

		const dadosRelatorio = movimentacoes.map((mov) => ({
			id: mov.id_movimentacao,
			data: mov.data_hora,
			produto: mov.produto.nome_produto,
			tipo: mov.tipo_movimentacao,
			quantidade: mov.quantidade,
			responsavel: mov.vendedor.nome_completo_vendedor,
		}));

		res.status(200).json(dadosRelatorio);
	}
}

export default new RelatorioController();
