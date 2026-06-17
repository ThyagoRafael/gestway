import { prisma } from "../config/prisma.js";
import { createVoucherSchema, updateVoucherSchema } from "../validations/voucher.validation.js";
import { AppError } from "../errors/AppError.js";
import { mapFields } from "../helpers/mapField.js";

class VoucherController {
	async create(req, res) {
		const bodyData = createVoucherSchema.parse(req.body);

		const voucher = await prisma.voucher.findUnique({
			where: {
				codigo_voucher: bodyData.code,
			},
		});

		if (voucher) {
			throw new AppError("Voucher já existente com o código informado");
		}

		const newVoucher = await prisma.voucher.create({
			data: {
				codigo_voucher: bodyData.code,
				porcentagem_desconto_voucher: bodyData.discount,
				data_inicio_voucher: bodyData.initialDate,
				data_validade_voucher: bodyData.expirationDate,
				descricao_voucher: bodyData.description,
			},
		});

		res.status(201).json(newVoucher);
	}

	async list(req, res) {
		const vouchers = await prisma.voucher.findMany();

		res.status(200).json(vouchers);
	}

	async update(req, res) {
		const voucherId = Number(req.params.voucherId);
		const bodyData = updateVoucherSchema.parse(req.body);
		const voucherFieldMap = {
			code: "codigo_voucher",
			discount: "porcentagem_desconto_voucher",
			description: "descricao_voucher",
			initialDate: "data_inicio_voucher",
			expirationDate: "data_validade_voucher",
		};

		const prismaData = mapFields(bodyData, voucherFieldMap);

		const voucher = await prisma.voucher.findUnique({
			where: {
				id_voucher: voucherId,
			},
		});

		if (!voucher) {
			throw new AppError("Voucher não encontrado", 404);
		}

		const initialDate = bodyData.initialDate ?? voucher.data_inicio_voucher;
		const expirationDate = bodyData.expirationDate ?? voucher.data_validade_voucher;

		if (expirationDate <= initialDate) {
			throw new AppError("A data de validade deve ser posterior à data inicial", 400);
		}

		const updatedVoucher = await prisma.voucher.update({
			where: {
				id_voucher: voucherId,
			},
			data: prismaData,
		});

		res.status(200).json(updatedVoucher);
	}
}

export default new VoucherController();
