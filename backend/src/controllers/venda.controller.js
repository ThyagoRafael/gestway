import { prisma } from "../config/prisma.js";
import { registerVendaSchema } from "../validations/venda.validation.js";
import { AppError } from "../errors/AppError.js";
import { getClienteId } from "../helpers/user.js";
class VendaController {
	async create(req, res) {
		const now = new Date();

		const bodyData = registerVendaSchema.parse(req.body);
		const { userId } = req.user;
		if (!userId) throw new AppError("Usuário não logado", 403);
		const clienteId = await getClienteId(userId);

		const vendedor = await prisma.vendedor.findFirst({
			select: {
				id_vendedor: true,
			},
			orderBy: {
				id_vendedor: "asc",
			},
		});

		let totalDesconto = 0;
		let totalLiquido = bodyData.totalBruto;

		if (bodyData.voucherCodigo) {
			const voucher = await prisma.voucher.findFirst({
				where: {
					codigo_voucher: bodyData.voucherCodigo,
					data_inicio_voucher: {
						lte: now,
					},
					data_validade_voucher: {
						gt: now,
					},
				},
				select: {
					porcentagem_desconto_voucher: true,
				},
			});

			if (voucher) {
				totalDesconto = bodyData.totalBruto.mul(voucher.porcentagem_desconto_voucher).div(100);
				totalLiquido = bodyData.totalBruto.sub(totalDesconto);
			}
		}

		await prisma.$transaction(async (tx) => {
			await tx.venda.create({
				data: {
					numero_pedido: bodyData.numeroPedido,
					id_carrinho: bodyData.idCarrinho,
					total_bruto: bodyData.totalBruto,
					total_desconto: totalDesconto,
					total_liquido: totalLiquido,
					id_vendedor: vendedor.id_vendedor,
					id_cliente: clienteId,
				},
			});

			const produtosCarrinho = await tx.carrinho_item.findMany({
				where: {
					id_carrinho: bodyData.idCarrinho,
				},
				select: {
					id_produto: true,
					quantidade: true,
				},
			});

			for (const produto of produtosCarrinho) {
				await tx.produto.update({
					where: {
						id_produto: produto.id_produto,
					},
					data: {
						estoque_atual_produto: {
							decrement: produto.quantidade,
						},
					},
				});
			}

			await tx.movimentacao_estoque.createMany({
				data: produtosCarrinho.map((produto) => ({
					id_produto: produto.id_produto,
					tipo_movimentacao: "SAIDA",
					quantidade: produto.quantidade,
					motivo: `Venda #${bodyData.numeroPedido}`,
					id_vendedor: vendedor.id_vendedor,
				})),
			});

			await tx.carrinho.update({
				where: {
					id_carrinho: bodyData.idCarrinho,
				},
				data: {
					status_carrinho: "CONVERTIDO_EM_PEDIDO",
				},
			});
		});

		res.status(201).json({ message: "Pedido efetuado com sucesso" });
	}

	async list(req, res) {
		const vendas = await prisma.venda.findMany({
			select: {
				numero_pedido: true,
				criado_em: true,
				atualizado_em: true,

				venda_item: {
					select: {
						produto: {
							select: {
								nome_produto: true,
							},
						},
					},
				},
				cliente: {
					select: {
						usuario: {
							select: {
								nome_completo_usuario: true,
							},
						},
					},
				},
				vendedor: {
					select: {
						nome_completo_vendedor: true,
					},
				},
			},
		});

		res.status(200).json(vendas);
	}
}

export default new VendaController();
