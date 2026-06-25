import { apiFetch } from "./api";

// Backend retorna: numero_pedido, status_pagamento, criado_em, atualizado_em,
//                  venda_item[]{produto{nome_produto}}, cliente{usuario{nome_completo_usuario}}, vendedor{nome_completo_vendedor}

function formatarData(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	return d.toLocaleDateString("pt-BR") + " - " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function mapStatus(s) {
	const map = { APROVADO: "Aprovado", RECUSADO: "Recusado", AGUARDANDO: "Aguardando", CANCELADO: "Cancelado", ESTORNADO: "Estornado" };
	return map[s] ?? s;
}

function mapVenda(v) {
	const produtos = (v.venda_item ?? []).map(i => i.produto?.nome_produto).filter(Boolean).join(", ");
	return {
		id:           v.numero_pedido,
		status:       mapStatus(v.status_pagamento),
		produto:      produtos || "—",
		vendedor:     v.vendedor?.nome_completo_vendedor ?? "—",
		cliente:      v.cliente?.usuario?.nome_completo_usuario ?? "—",
		criadoEm:     formatarData(v.criado_em),
		atualizadoEm: formatarData(v.atualizado_em),
	};
}

export async function getVendas() {
	const data = await apiFetch("/vendas");
	return data.map(mapVenda);
}
