import { apiFetch } from "./api";

// ── mapeamento: campos do backend → campos do frontend ──────────────────────
// Backend retorna: id_vendedor, nome_completo_vendedor, email_vendedor,
//                  meta_mensal_vendedor, taxa_comissao_vendedor,
//                  comissao_mensal_vendedor[]{valor_comissao},
//                  venda[]{total_liquido}
function mapVendedor(v) {
	const vendaMes = (v.venda ?? []).reduce(
		(sum, venda) => sum + Number(venda.total_liquido ?? 0), 0
	);
	const comissaoMes = (v.comissao_mensal_vendedor ?? []).reduce(
		(sum, c) => sum + Number(c.valor_comissao ?? 0), 0
	);

	return {
		id:               v.id_vendedor,
		nome:             v.nome_completo_vendedor,
		email:            v.email_vendedor,
		cpf: v.cpf_vendedor,
		metaMes:          v.meta_mensal_vendedor ?? "0",
		taxaComissao:     v.taxa_comissao_vendedor ?? "0",
		vendaMes,
		qtdVendas:        (v.venda ?? []).length,
		comissaoMes,
		comissaoPendente: 0,
		statusComissao:   "aprovado",
		foto:             v.foto_url_vendedor,
	};
}

/** GET /api/vendedores */
export async function getVendedores() {
	const data = await apiFetch("/vendedores");
	return data.map(mapVendedor);
}

/** POST /api/vendedores — { name, email, monthlyTarget, commissionRate } */
export async function createVendedor(formData) {
	const data = await apiFetch("/vendedores", {
		method: "POST",
		body: formData,
	});
	return mapVendedor(data);
}

/** PATCH /api/vendedores/:id */
export async function updateVendedor(id, formData) {
	const data = await apiFetch(`/vendedores/${id}`, {
		method: "PATCH",
		body: formData,
	});

	
	return mapVendedor(data);
}
