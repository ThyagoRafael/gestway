import { apiFetch } from "./api";

// Backend retorna: id_movimentacao, data_hora, tipo_movimentacao, quantidade,
//                  motivo, produto{ nome_produto }, vendedor{ nome_completo_vendedor }

function formatarData(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	return (
		d.toLocaleDateString("pt-BR") +
		" - " +
		d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
	);
}

// backend usa "ENTRADA" | "SAIDA" | "AJUSTE" (maiúsculo sem acento)
const TIPO_MAP = {
	ENTRADA: "Entrada",
	SAIDA:   "Saída",
	AJUSTE:  "Ajuste",
};

function mapMovimentacao(m) {
	const qtd = Number(m.quantidade ?? 0);
	return {
		id:          m.id_movimentacao,
		dataHora:    formatarData(m.data_hora),
		produto:     m.produto?.nome_produto ?? "—",
		tipo:        TIPO_MAP[m.tipo_movimentacao] ?? m.tipo_movimentacao,
		qtd:         m.tipo_movimentacao === "SAIDA" ? -Math.abs(qtd) : qtd,
		motivo:      m.motivo ?? "—",
		responsavel: m.vendedor?.nome_completo_vendedor ?? "—",
	};
}

/** GET /api/movimentacoes */
export async function getMovimentacoes() {
	const data = await apiFetch("/movimentacoes");
	return data.map(mapMovimentacao);
}
