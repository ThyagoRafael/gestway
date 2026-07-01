import { prisma } from "../config/prisma.js";

export async function getOrCreateCarrinho(clienteId) {
	let carrinho = await prisma.carrinho.findFirst({
		where: { id_cliente: clienteId, status_carrinho: "ABERTO" },
		include: {
			carrinho_item: {
				include: {
					produto: {
						select: {
							id_produto:            true,
							nome_produto:          true,
							preco_produto:         true,
							desconto_produto:      true,  // ← novo
							imagem_produto:        true,
							estoque_atual_produto: true,
							status_produto:        true,
						},
					},
				},
			},
		},
	});

	if (!carrinho) {
		carrinho = await prisma.carrinho.create({
			data: {
				comprador_tipo: "COMPRADOR",
				comprador_id:   clienteId,
				id_cliente:     clienteId,
				status_carrinho: "ABERTO",
			},
			include: { carrinho_item: { include: { produto: true } } },
		});
	}

	return carrinho;
}

export function formatCarrinho(carrinho) {
	const itens = carrinho.carrinho_item.map((item) => {
		const desconto  = Number(item.produto.desconto_produto ?? 0);
		const precoBase = Number(item.preco_unitario_snapshot ?? item.produto.preco_produto);
		const preco     = desconto > 0 ? precoBase * (1 - desconto / 100) : precoBase;
		const precoOld  = desconto > 0 ? precoBase : null;

		return {
			id:                Number(item.id_carrinho_item),
			idProduto:         item.id_produto,
			nome:              item.produto.nome_produto,
			imagem:            item.produto.imagem_produto ?? null,
			preco,
			precoOld,
			desconto,
			qtd:               item.quantidade,
			estoqueDisponivel: item.produto.estoque_atual_produto,
		};
	});

	const total = itens.reduce((sum, i) => sum + i.preco * i.qtd, 0);

	return {
		id:       Number(carrinho.id_carrinho),
		status:   carrinho.status_carrinho,
		itens,
		total,
		qtdTotal: itens.reduce((sum, i) => sum + i.qtd, 0),
	};
}
