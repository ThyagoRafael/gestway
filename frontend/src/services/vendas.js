import { apiFetch } from "./api";

/** GET /api/vendas — lista todas as vendas (admin) */
export async function getVendas() {
	const data = await apiFetch("/vendas");
	return data.map((v) => ({
		id: v.numero_pedido,
		criadoEm: v.criado_em ? new Date(v.criado_em).toLocaleString("pt-BR") : "—",
		atualizadoEm: v.atualizado_em ? new Date(v.atualizado_em).toLocaleString("pt-BR") : "—",
		cliente: v.cliente?.usuario?.nome_completo_usuario ?? "—",
		vendedor: v.vendedor?.nome_completo_vendedor ?? "—",
		produtos: (v.venda_item ?? []).map((i) => i.produto?.nome_produto).filter(Boolean).join(", "),
		totalBruto: Number(v.total_bruto ?? 0),
		totalLiquido: Number(v.total_liquido ?? 0),
		status: v.status_venda ?? "—",
	}));
}

/**
 * POST /api/vendas
 * { idCarrinho, numeroPedido, voucherCodigo? }
 */
export async function criarVenda({ idCarrinho, numeroPedido, voucherCodigo }) {
	return apiFetch("/vendas", {
		method: "POST",
		body: JSON.stringify({
			idCarrinho,
			numeroPedido,
			...(voucherCodigo ? { voucherCodigo } : {}),
		}),
	});
}
