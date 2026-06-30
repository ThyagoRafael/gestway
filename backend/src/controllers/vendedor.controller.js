import { prisma } from "../config/prisma.js";
import { createVendedorSchema, updateVendedorSchema } from "../validations/vendedor.validation.js";
import { AppError } from "../errors/AppError.js";
import { mapFields } from "../helpers/mapField.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../helpers/cloudinary.js";
class VendedorController {
	async create(req, res) {
		const bodyData = createVendedorSchema.parse(req.body);
		const vendedorImage = req.file;

		const vendedor = await prisma.vendedor.findFirst({
			where: {
				OR: [{ email_vendedor: bodyData.email }, { cpf_vendedor: bodyData.cpf }],
			},
		});

		if (vendedor) {
			if (vendedor.email_vendedor === bodyData.email) {
				throw new AppError("Já existe um vendedor com esse e-mail.", 400);
			}

			if (vendedor.cpf_vendedor === bodyData.cpf) {
				throw new AppError("Já existe um vendedor com esse CPF.", 400);
			}
		}

		let imageData = null;

		try {
			if (vendedorImage) {
				imageData = await uploadToCloudinary(vendedorImage.buffer, "gestway/vendedores");
			}

			const newVendedor = await prisma.vendedor.create({
				data: {
					nome_completo_vendedor: bodyData.name,
					email_vendedor: bodyData.email,
					cpf_vendedor: bodyData.cpf,
					meta_mensal_vendedor: bodyData.monthlyTarget,
					taxa_comissao_vendedor: bodyData.commissionRate,
					foto_url_vendedor: imageData ? imageData.secure_url : null,
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
		} catch (error) {
			if (imageData) {
				await deleteFromCloudinary(imageData.public_id);
			}

			throw error;
		}
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
			cpf: "cpf_vendedor",
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

		if (bodyData.email) {
			const vendedor = await prisma.vendedor.findFirst({
				where: {
					id_vendedor: {
						not: vendedorId,
					},
					email_vendedor: bodyData.email,
				},
			});

			if (vendedor) {
				throw new AppError("Vendedor já existente com o email informado", 400);
			}
		}

		if (bodyData.cpf) {
			const vendedor = await prisma.vendedor.findFirst({
				where: {
					id_vendedor: {
						not: vendedorId,
					},
					cpf_vendedor: bodyData.cpf,
				},
			});

			if (vendedor) {
				throw new AppError("Vendedor já existente com o CPF informado", 400);
			}
		}

		let imageData = null;

		if (req.file) {
			imageData = await uploadToCloudinary(req.file.buffer, "gestway/vendedores");
		}

		const updatedVendedor = await prisma.vendedor.update({
			where: {
				id_vendedor: vendedorId,
			},
			data: {
				...prismaData,
				...(imageData && {
					foto_url_vendedor: imageData.secure_url,
				}),
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

		res.status(200).json(updatedVendedor);
	}
}

export default new VendedorController();
