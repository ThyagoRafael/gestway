import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { createCarrinhoItemSchema, updateCarrinhoItemSchema } from "../validations/carrinho.validation.js";
import { getOrCreateCarrinho, formatCarrinho } from "../helpers/carrinho.js";
import { getClienteId } from "../helpers/user.js";

// ── controller ───────────────────────────────────────────────────────────────

class CarrinhoController {
	// GET /api/carrinho
	async get(req, res) {
		const userId = req.user.userId;
		if (!userId) throw new AppError("Usuário não é um cliente", 403);
		const clienteId = await getClienteId(userId);

		const carrinho = await getOrCreateCarrinho(clienteId);
		res.status(200).json(formatCarrinho(carrinho));
	}

	// POST /api/carrinho/itens  — body: { idProduto, quantidade }
	async addItem(req, res) {
		const userId = req.user.userId;
		if (!userId) throw new AppError("Usuário não é um cliente", 403);
		const clienteId = await getClienteId(userId);

		const { idProduto, quantidade } = createCarrinhoItemSchema.parse(req.body);

		// verifica se produto existe e tem estoque
		const produto = await prisma.produto.findUnique({
			where: { id_produto: idProduto },
		});
		if (!produto) throw new AppError("Produto não encontrado", 404);
		if (produto.estoque_atual_produto < quantidade) throw new AppError("Estoque insuficiente", 400);

		const carrinho = await getOrCreateCarrinho(clienteId);

		const itemExistente = carrinho.carrinho_item.find((i) => i.id_produto === idProduto);

		if (itemExistente) {
			const novaQtd = itemExistente.quantidade + quantidade;
			if (novaQtd > produto.estoque_atual_produto)
				throw new AppError("Estoque insuficiente para a quantidade solicitada", 400);

			await prisma.carrinho_item.update({
				where: { id_carrinho_item: itemExistente.id_carrinho_item },
				data: { quantidade: novaQtd },
			});
		} else {
			await prisma.carrinho_item.create({
				data: {
					id_carrinho: carrinho.id_carrinho,
					id_produto: idProduto,
					quantidade,
					preco_unitario_snapshot: produto.preco_produto,
				},
			});
		}

		// recarrega com os itens atualizados
		const atualizado = await getOrCreateCarrinho(clienteId);
		res.status(200).json(formatCarrinho(atualizado));
	}

	// PATCH /api/carrinho/itens/:idProduto  — body: { quantidade }
	async updateItem(req, res) {
		const userId = req.user.userId;
		if (!userId) throw new AppError("Usuário não é um cliente", 403);
		const clienteId = await getClienteId(userId);

		const idProduto = Number(req.params.idProduto);
		const { quantidade } = updateCarrinhoItemSchema.parse(req.body);

		const carrinho = await getOrCreateCarrinho(clienteId);

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
			if (produto && quantidade > produto.estoque_atual_produto) throw new AppError("Estoque insuficiente", 400);

			await prisma.carrinho_item.update({
				where: { id_carrinho_item: item.id_carrinho_item },
				data: { quantidade },
			});
		}

		const atualizado = await getOrCreateCarrinho(clienteId);
		res.status(200).json(formatCarrinho(atualizado));
	}

	// DELETE /api/carrinho/itens/:idProduto
	async removeItem(req, res) {
		const userId = req.user.userId;
		if (!userId) throw new AppError("Usuário não é um cliente", 403);
		const clienteId = await getClienteId(userId);

		const idProduto = Number(req.params.idProduto);

		const carrinho = await getOrCreateCarrinho(clienteId);
		const item = carrinho.carrinho_item.find((i) => i.id_produto === idProduto);
		if (!item) throw new AppError("Item não encontrado no carrinho", 404);

		await prisma.carrinho_item.delete({
			where: { id_carrinho_item: item.id_carrinho_item },
		});

		const atualizado = await getOrCreateCarrinho(clienteId);
		res.status(200).json(formatCarrinho(atualizado));
	}

	// DELETE /api/carrinho — limpa o carrinho (cancela)
	async clear(req, res) {
		const userId = req.user.userId;
		if (!userId) throw new AppError("Usuário não é um cliente", 403);
		const clienteId = await getClienteId(userId);

		const carrinho = await prisma.carrinho.findFirst({
			where: { id_cliente: clienteId, status_carrinho: "ABERTO" },
		});

		if (carrinho) {
			// deleta os itens em cascata e marca como CANCELADO
			await prisma.carrinho.update({
				where: { id_carrinho: carrinho.id_carrinho },
				data: { status_carrinho: "CANCELADO" },
			});
		}

		res.status(200).json({ message: "Carrinho limpo com sucesso." });
	}
}

export default new CarrinhoController();
