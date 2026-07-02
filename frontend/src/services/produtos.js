import { apiFetch } from "./api";

function calcStatus(estoque, estoqueMinimo = 0) {
	if (estoque === null || estoque === undefined) return "disponivel";
	if (estoque === 0)           return "indisponivel";
	if (estoque < estoqueMinimo) return "baixo";
	return "disponivel";
}

function mapProduto(p) {
	const desconto  = Number(p.desconto_produto ?? p.discount ?? 0);
	const precoBase = Number(p.preco_produto ?? 0);
	// preço final já com desconto aplicado
	const preco     = desconto > 0
		? precoBase * (1 - desconto / 100)
		: precoBase;
	// preço original (sem desconto) — usado como precoOld na landing
	const precoOld  = desconto > 0 ? precoBase : null;

	return {
		id:             p.id_produto,
		nome:           p.nome_produto,
		preco,
		precoOld,
		desconto,
		descricao:      p.descricao_produto ?? "",
		estoqueInicial: p.estoque_inicial_produto ?? 0,
		estoqueMinimo:  p.estoque_minimo_produto  ?? 0,
		estoqueAtual:   p.estoque_atual_produto   ?? 0,
		estoque:        p.estoque_atual_produto   ?? p.estoque_inicial_produto ?? 0,
		idCategoria:    p.id_categoria,
		categoria:      p.categoria?.nome_categoria ?? "",
		status:         p.status_produto
			? p.status_produto.toLowerCase()
			: calcStatus(p.estoque_inicial_produto, p.estoque_minimo_produto),
		imagem:         p.imagem_produto ?? null,
	};
}

/**
 * GET /api/produtos
 * @param {string} [categoria] — filtra pelo nome da categoria
 */
export async function getProdutos(categoria) {
	const data = await apiFetch("/produtos");
	const todos = data.map(mapProduto);
	if (categoria) {
		return todos.filter(
			p => p.categoria.toLowerCase() === categoria.toLowerCase()
		);
	}
	return todos;
}

/** POST /api/produtos — exige token */
export async function createProduto(formData) {
	const data = await apiFetch("/produtos", {
		method: "POST",
		body: formData,
	});
	return mapProduto(data);
}

/** PATCH /api/produtos/:id — exige token */
export async function updateProduto(id, fields) {
	const data = await apiFetch(`/produtos/${id}`, {
		method: "PATCH",
		body: fields,
	});
	return mapProduto(data);
}
