import { prisma } from "../config/prisma.js";
import { createVendedorSchema } from "../validations/vendedor.validation.js";
import { AppError } from "../errors/AppError.js";

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
		});

		res.status(201).json(newVendedor);
	}

	async list(req, res) {
		const vendedores = await prisma.vendedor.findMany();

		res.status(200).json(vendedores);
	}
}

export default new VendedorController();
