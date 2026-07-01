import { apiFetch } from "./api";

function calcStatus(estoque, estoqueMinimo = 0) {
	if (estoque === null || estoque === undefined) return "disponivel";
	if (estoque === 0)           return "indisponivel";
	if (estoque < estoqueMinimo) return "baixo";
	return "disponivel";
}

function mapProduto(p) {
	return {
		id:             p.id_produto,
		nome:           p.nome_produto,
		preco:          Number(p.preco_produto ?? 0),
		descricao:      p.descricao_produto ?? "",
		estoqueInicial: p.estoque_inicial_produto,
		estoqueMinimo:  p.estoque_minimo_produto,
		estoqueAtual:   p.estoque_atual_produto,
		estoque:        p.estoque_atual_produto ?? p.estoque_inicial_produto ?? 0,
		idCategoria:    p.id_categoria,
		categoria:      p.categoria?.nome_categoria ?? "",
		status:         calcStatus(p.estoque_inicial_produto),
		imagem:         p.imagem_produto ?? null,
	};
}

/**
 * GET /api/produtos
 * @param {string} [categoria] — se informado, filtra pelo nome da categoria
 */
export async function getProdutos(categoria) {
	const data = await apiFetch("/produtos");
	const todos = data.map(mapProduto);

	// filtra pelo nome da categoria se vier como parâmetro
	if (categoria) {
		return todos.filter(
			(p) => p.categoria.toLowerCase() === categoria.toLowerCase()
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
