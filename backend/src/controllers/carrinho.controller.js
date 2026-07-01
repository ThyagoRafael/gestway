import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { createCarrinhoItemSchema, updateCarrinhoItemSchema } from "../validations/carrinho.validation.js";

// ── helpers ─────────────────────────────────────────────────────────────────

// Busca ou cria o carrinho ABERTO do cliente
async function getOrCreateCarrinho(idCliente) {
	let carrinho = await prisma.carrinho.findFirst({
		where: { id_cliente: idCliente, status_carrinho: "ABERTO" },
		include: {
			carrinho_item: {
				include: {
					produto: {
						select: {
							id_produto:       true,
							nome_produto:     true,
							preco_produto:    true,
							imagem_produto:   true,
							estoque_atual_produto: true,
							status_produto:   true,
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
				comprador_id:   idCliente,
				id_cliente:     idCliente,
				status_carrinho: "ABERTO",
			},
			include: { carrinho_item: { include: { produto: true } } },
		});
	}

	return carrinho;
}

// Formata o carrinho para o frontend
function formatCarrinho(carrinho) {
	const itens = carrinho.carrinho_item.map((item) => ({
		id:                item.id_carrinho_item,
		idProduto:         item.id_produto,
		nome:              item.produto.nome_produto,
		imagem:            item.produto.imagem_produto ?? null,
		preco:             Number(item.preco_unitario_snapshot ?? item.produto.preco_produto),
		qtd:               item.quantidade,
		estoqueDisponivel: item.produto.estoque_atual_produto,
	}));

	const total = itens.reduce((sum, i) => sum + i.preco * i.qtd, 0);

	return {
		id:     Number(carrinho.id_carrinho),
		status: carrinho.status_carrinho,
		itens,
		total,
		qtdTotal: itens.reduce((sum, i) => sum + i.qtd, 0),
	};
}

// ── controller ───────────────────────────────────────────────────────────────

class CarrinhoController {
	// GET /api/carrinho
	async get(req, res) {
		const idCliente = req.user.idCliente;
		if (!idCliente) throw new AppError("Usuário não é um cliente", 403);

		const carrinho = await getOrCreateCarrinho(idCliente);
		res.status(200).json(formatCarrinho(carrinho));
	}

	// POST /api/carrinho/itens  — body: { idProduto, quantidade }
	async addItem(req, res) {
		const idCliente = req.user.idCliente;
		if (!idCliente) throw new AppError("Usuário não é um cliente", 403);

		const { idProduto, quantidade } = createCarrinhoItemSchema.parse(req.body);

		// verifica se produto existe e tem estoque
		const produto = await prisma.produto.findUnique({
			where: { id_produto: idProduto },
		});
		if (!produto) throw new AppError("Produto não encontrado", 404);
		if (produto.estoque_atual_produto < quantidade)
			throw new AppError("Estoque insuficiente", 400);

		const carrinho = await getOrCreateCarrinho(idCliente);

		const itemExistente = carrinho.carrinho_item.find(
			(i) => i.id_produto === idProduto
		);

		if (itemExistente) {
			const novaQtd = itemExistente.quantidade + quantidade;
			if (novaQtd > produto.estoque_atual_produto)
				throw new AppError("Estoque insuficiente para a quantidade solicitada", 400);

			await prisma.carrinho_item.update({
				where: { id_carrinho_item: itemExistente.id_carrinho_item },
				data:  { quantidade: novaQtd, atualizado_em: new Date() },
			});
		} else {
			await prisma.carrinho_item.create({
				data: {
					id_carrinho:             carrinho.id_carrinho,
					id_produto:              idProduto,
					quantidade,
					preco_unitario_snapshot: produto.preco_produto,
				},
			});
		}

		// recarrega com os itens atualizados
		const atualizado = await getOrCreateCarrinho(idCliente);
		res.status(200).json(formatCarrinho(atualizado));
	}

	// PATCH /api/carrinho/itens/:idProduto  — body: { quantidade }
	async updateItem(req, res) {
		const idCliente = req.user.idCliente;
		if (!idCliente) throw new AppError("Usuário não é um cliente", 403);

		const idProduto = Number(req.params.idProduto);
		const { quantidade } = updateCarrinhoItemSchema.parse(req.body);

		const carrinho = await getOrCreateCarrinho(idCliente);

		const item = carrinho.carrinho_item.find((i) => i.id_produto === idProduto);
		if (!item) throw new AppError("Item não encontrado no carrinho", 404);

		if (quantidade <= 0) {
			await prisma.carrinho_item.delete({
				where: { id_carrinho_item: item.id_carrinho_item },
			});
		} else {
			const produto = await prisma.produto.findUnique({
				where: { id_produto: idProduto },
			});
			if (produto && quantidade > produto.estoque_atual_produto)
				throw new AppError("Estoque insuficiente", 400);

			await prisma.carrinho_item.update({
				where: { id_carrinho_item: item.id_carrinho_item },
				data:  { quantidade, atualizado_em: new Date() },
			});
		}

		const atualizado = await getOrCreateCarrinho(idCliente);
		res.status(200).json(formatCarrinho(atualizado));
	}

	// DELETE /api/carrinho/itens/:idProduto
	async removeItem(req, res) {
		const idCliente = req.user.idCliente;
		if (!idCliente) throw new AppError("Usuário não é um cliente", 403);

		const idProduto = Number(req.params.idProduto);

		const carrinho = await getOrCreateCarrinho(idCliente);
		const item = carrinho.carrinho_item.find((i) => i.id_produto === idProduto);
		if (!item) throw new AppError("Item não encontrado no carrinho", 404);

		await prisma.carrinho_item.delete({
			where: { id_carrinho_item: item.id_carrinho_item },
		});

		const atualizado = await getOrCreateCarrinho(idCliente);
		res.status(200).json(formatCarrinho(atualizado));
	}

	// DELETE /api/carrinho — limpa o carrinho (cancela)
	async clear(req, res) {
		const idCliente = req.user.idCliente;
		if (!idCliente) throw new AppError("Usuário não é um cliente", 403);

		const carrinho = await prisma.carrinho.findFirst({
			where: { id_cliente: idCliente, status_carrinho: "ABERTO" },
		});

		if (carrinho) {
			// deleta os itens em cascata e marca como CANCELADO
			await prisma.carrinho.update({
				where: { id_carrinho: carrinho.id_carrinho },
				data:  { status_carrinho: "CANCELADO", atualizado_em: new Date() },
			});
		}

		res.status(200).json({ message: "Carrinho limpo com sucesso." });
	}
}

export default new CarrinhoController();
