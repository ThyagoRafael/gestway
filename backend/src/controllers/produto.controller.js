import { prisma } from "../config/prisma.js";
import { createProdutoSchema, updateProdutoSchema } from "../validations/produto.validation.js";
import { AppError } from "../errors/AppError.js";
import { mapFields } from "../helpers/mapField.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../helpers/cloudinary.js";

// Calcula o status automático baseado no estoque
// Se vier status manual (INATIVO), respeita. Senão calcula.
function calcularStatus(estoqueAtual, estoqueMinimo, statusManual) {
	if (statusManual === "INATIVO")       return "INATIVO";
	if (estoqueAtual === 0)               return "INDISPONIVEL";
	if (estoqueAtual <= estoqueMinimo)    return "BAIXO_ESTOQUE";
	return "DISPONIVEL";
}

class ProdutoController {
	async create(req, res) {
		const bodyData = createProdutoSchema.parse(req.body);
		const produtoImage = req.file;

		const categoria = await prisma.categoria.findUnique({
			where: { id_categoria: bodyData.idCategoria },
		});

		if (!categoria) throw new AppError("Categoria não encontrada", 404);

		if (bodyData.initialStock < bodyData.minStock) {
			throw new AppError("O estoque inicial deve ser maior que o estoque mínimo", 400);
		}

		const statusCalculado = calcularStatus(
			bodyData.initialStock,
			bodyData.minStock,
			null
		);

		let uploadResult = null;

		try {
			if (produtoImage) {
				uploadResult = await uploadToCloudinary(produtoImage.buffer, "gestway/produtos");
			}

			const newProduto = await prisma.produto.create({
				data: {
					nome_produto:            bodyData.name,
					preco_produto:           bodyData.price,
					desconto_produto:        bodyData.discount ?? 0,
					descricao_produto:       bodyData.description,
					id_categoria:            bodyData.idCategoria,
					estoque_inicial_produto: bodyData.initialStock,
					estoque_minimo_produto:  bodyData.minStock,
					estoque_atual_produto:   bodyData.initialStock,
					status_produto:          statusCalculado,
					imagem_produto:          uploadResult ? uploadResult.secure_url : null,
				},
				include: {
					categoria: { select: { nome_categoria: true } },
				},
			});

			res.status(201).json(newProduto);
		} catch (error) {
			if (uploadResult) await deleteFromCloudinary(uploadResult.public_id);
			throw error;
		}
	}

	async list(req, res) {
		const produtos = await prisma.produto.findMany({
			include: {
				categoria: { select: { nome_categoria: true } },
			},
		});

		res.status(200).json(produtos);
	}

	async update(req, res) {
		const produtoId = Number(req.params.produtoId);
		const bodyData  = updateProdutoSchema.parse(req.body);

		const produto = await prisma.produto.findUnique({
			where: { id_produto: produtoId },
		});

		if (!produto) throw new AppError("Produto não encontrado", 404);

		const produtoFieldMap = {
			name:         "nome_produto",
			price:        "preco_produto",
			description:  "descricao_produto",
			idCategoria:  "id_categoria",
			initialStock: "estoque_inicial_produto",
			minStock:     "estoque_minimo_produto",
			discount:     "desconto_produto",
		};

		const prismaData = mapFields(bodyData, produtoFieldMap);

		// recalcula estoque_atual e status
		const novoEstoqueInicial = bodyData.initialStock ?? produto.estoque_inicial_produto;
		const novoEstoqueMinimo  = bodyData.minStock      ?? produto.estoque_minimo_produto;

		// status: manual vem do frontend como "disponivel"/"inativo" (minúsculo) — normaliza
		const statusRaw    = bodyData.status ? bodyData.status.toUpperCase() : null;
		const statusFinal  = calcularStatus(novoEstoqueInicial, novoEstoqueMinimo, statusRaw);

		let imageData = null;
		if (req.file) {
			imageData = await uploadToCloudinary(req.file.buffer, "gestway/produtos");
		}

		const updatedProduto = await prisma.produto.update({
			where: { id_produto: produtoId },
			data: {
				...prismaData,
				estoque_atual_produto: novoEstoqueInicial,
				status_produto:        statusFinal,
				...(imageData && { imagem_produto: imageData.secure_url }),
			},
			include: {
				categoria: { select: { nome_categoria: true } },
			},
		});

		return res.status(200).json(updatedProduto);
	}
}

export default new ProdutoController();
