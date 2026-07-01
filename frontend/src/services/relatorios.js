import { apiFetch } from "./api";

const BRL = (v) => Number(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: "currency", currency: "BRL" });
const fmt = (iso) => iso ? new Date(iso).toLocaleDateString("pt-BR") : "";

export async function getRelatorioVendasMensais() {
	const data = await apiFetch("/relatorios/vendas-mensais");
	return data.map(v => ({
		Vendedor:              v.nome,
		"Qtd Vendas":          v.quantidadeVendas,
		"Qtd Produtos":        v.quantidadeProdutosVendidos,
		"Faturamento Mensal":  BRL(v.faturamentoMensal),
	}));
}

export async function getRelatorioInventario() {
	const data = await apiFetch("/relatorios/inventario-estoque");
	return data.map(p => ({
		Produto:       p.nome,
		Quantidade:    p.quantidade,
		"Valor Total": BRL(p.valorTotal),
	}));
}

export async function getRelatorioDesempenhoVendedores() {
	const data = await apiFetch("/relatorios/desempenho-vendedores");
	return data.map(v => ({
		Vendedor:      v.nome,
		"Qtd Vendas":  v.quantidadeVendas,
		Faturamento:   BRL(v.faturamento),
		"Comissão":    BRL(v.comissao),
	}));
}

export async function getRelatorioMovimentacoes() {
	const data = await apiFetch("/relatorios/movimentacao-estoque");
	return data.map(m => ({
		Data:         fmt(m.data),
		Produto:      m.produto,
		Tipo:         m.tipo,
		Quantidade:   m.quantidade,
		Responsável:  m.responsavel,
	}));
}
