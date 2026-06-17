import { prisma } from "../config/prisma.js";
import { createProdutoSchema, updateProdutoSchema } from "../validations/produto.validation.js";
import { AppError } from "../errors/AppError.js";
import { mapFields } from "../helpers/mapField.js";

class ProdutoController {
	async create(req, res) {
		const bodyData = createProdutoSchema.parse(req.body);

		const categoria = await prisma.categoria.findUnique({
			where: {
				id_categoria: bodyData.idCategoria,
			},
		});

		if (!categoria) {
			throw new AppError("Categoria não encontrada", 404);
		}

		const newProduto = await prisma.produto.create({
			data: {
				nome_produto: bodyData.name,
				preco_produto: bodyData.price,
				descricao_produto: bodyData.description,
				id_categoria: bodyData.idCategoria,
				estoque_produto: bodyData.stock,
			},
		});

		res.status(201).json(newProduto);
	}

	async list(req, res) {
		const produtos = await prisma.produto.findMany({
			include: {
				categoria: {
					select: {
						nome_categoria: true,
					},
				},
			},
		});

		res.status(200).json(produtos);
	}

	async update(req, res) {
		const produtoId = Number(req.params.produtoId);
		const bodyData = updateProdutoSchema.parse(req.body);
		const produtoFieldMap = {
			name: "nome_produto",
			price: "preco_produto",
			description: "descricao_produto",
			idCategoria: "id_categoria",
			stock: "estoque_produto",
		};

		const prismaData = mapFields(bodyData, produtoFieldMap);

		const produto = await prisma.produto.findUnique({
			where: {
				id_produto: produtoId,
			},
		});

		if (!produto) {
			throw new AppError("Produto não encontrado", 404);
		}

		const updatedProduto = await prisma.produto.update({
			where: {
				id_produto: produtoId,
			},
			data: prismaData,
		});

		res.status(200).json(updatedProduto);
	}
}

export default new ProdutoController();
