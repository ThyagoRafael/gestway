import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { updateCategoriaSchema } from "../validations/categoria.validation.js";

class CategoriaController {
	async createCategoria(req, res) {
		const { name, description } = req.body;

		const newCategoria = await prisma.categoria.create({
			data: {
				nome_categoria: name,
				descricao_categoria: description,
			},
		});

		res.status(201).json(newCategoria);
	}

	async listCategoria(req, res) {
		const categorias = await prisma.categoria.findMany({
			orderBy: { data_atualizacao_categoria: "desc" },
		});

		res.status(200).json(categorias);
	}

	async updateCategoria(req, res) {
		const categoriaId = Number(req.params.categoriaId);
		const updateData = updateCategoriaSchema.parse(req.body);

		const prismaData = {};

		if ("name" in updateData) {
			prismaData.nome_categoria = updateData.name;
		}

		if ("description" in updateData) {
			prismaData.descricao_categoria = updateData.description;
		}

		const categoria = await prisma.categoria.findUnique({
			where: {
				id_categoria: categoriaId,
			},
		});

		if (!categoria) {
			throw new AppError("Categoria não encontrada", 404);
		}

		const updatedCategoria = await prisma.categoria.update({
			where: {
				id_categoria: categoriaId,
			},
			data: prismaData,
		});

		res.status(200).json(updatedCategoria);
	}
}

export default new CategoriaController();
