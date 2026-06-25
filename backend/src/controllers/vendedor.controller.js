import { prisma } from "../config/prisma.js";
import { createVendedorSchema, updateVendedorSchema } from "../validations/vendedor.validation.js";
import { AppError } from "../errors/AppError.js";
import { mapFields } from "../helpers/mapField.js";

class VendedorController {
	async create(req, res) {
		const bodyData = createVendedorSchema.parse(req.body);

		const vendedor = await prisma.vendedor.findUnique({
			where: {
				email_vendedor: bodyData.email,
			},
		});

		if (vendedor) {
			throw new AppError("Vendedor já existente com o email informado", 400);
		}

		const newVendedor = await prisma.vendedor.create({
			data: {
				nome_completo_vendedor: bodyData.name,
				email_vendedor: bodyData.email,
				meta_mensal_vendedor: bodyData.monthlyTarget,
				taxa_comissao_vendedor: bodyData.commissionRate,
			},
			include: {
				comissao_mensal_vendedor: {
					select: {
						valor_comissao: true,
					},
				},
				venda: {
					select: {
						total_liquido: true,
					},
				},
			},
		});

		res.status(201).json(newVendedor);
	}

	async list(req, res) {
		const vendedores = await prisma.vendedor.findMany({
			include: {
				comissao_mensal_vendedor: {
					select: {
						valor_comissao: true,
					},
				},
				venda: {
					select: {
						total_liquido: true,
					},
				},
			},
		});

		res.status(200).json(vendedores);
	}

	async update(req, res) {
		const vendedorId = Number(req.params.vendedorId);
		const bodyData = updateVendedorSchema.parse(req.body);
		const vendedorMapField = {
			name: "nome_completo_vendedor",
			email: "email_vendedor",
			monthlyTarget: "meta_mensal_vendedor",
			commissionRate: "taxa_comissao_vendedor",
		};

		const prismaData = mapFields(bodyData, vendedorMapField);

		const vendedor = await prisma.vendedor.findUnique({
			where: {
				id_vendedor: vendedorId,
			},
		});

		if (!vendedor) {
			throw new AppError("Vendedor não encontrado", 404);
		}

		const updatedVendedor = await prisma.vendedor.update({
			where: {
				id_vendedor: vendedorId,
			},
			data: prismaData,
			include: {
				comissao_mensal_vendedor: {
					select: {
						valor_comissao: true,
					},
				},
				venda: {
					select: {
						total_liquido: true,
					},
				},
			},
		});

		res.status(200).json(updatedVendedor);
	}
}

export default new VendedorController();
