import { apiFetch } from "./api";

// ── mapeamento: backend → frontend ──────────────────────────────────────────
// Backend retorna: id_produto, nome_produto, preco_produto, descricao_produto,
//                  estoque_produto, id_categoria, categoria{ nome_categoria }
function calcStatus(estoque, estoqueMinimo = 0) {
	if (estoque === null || estoque === undefined) return "disponivel";
	if (estoque === 0)           return "indisponivel";
	if (estoque < estoqueMinimo) return "baixo";
	return "disponivel";
}

function mapProduto(p) {
	const estoque = Number(p.estoque_produto ?? 0);
	return {
		id:            p.id_produto,
		nome:          p.nome_produto,
		preco:         Number(p.preco_produto ?? 0),
		descricao:     p.descricao_produto ?? "",
		estoque,
		estoqueMinimo: 0, // backend não expõe estoque mínimo ainda
		idCategoria:   p.id_categoria,
		categoria:     p.categoria?.nome_categoria ?? "",
		status:        calcStatus(estoque),
		imagem:        null,
	};
}

/** GET /api/produtos */
export async function getProdutos() {
	const data = await apiFetch("/produtos");
	return data.map(mapProduto);
}

/**
 * POST /api/produtos  — exige token
 * { name, price, description, idCategoria, stock }
 */
export async function createProduto({ name, price, description, idCategoria, stock }) {
	const data = await apiFetch("/produtos", {
		method: "POST",
		body: JSON.stringify({ name, price, description, idCategoria, stock }),
	});
	return mapProduto(data);
}

/**
 * PATCH /api/produtos/:id  — exige token
 * Campos opcionais: name, price, description, idCategoria, stock
 * Atualizar stock gera movimentação automática no backend.
 */
export async function updateProduto(id, fields) {
	const data = await apiFetch(`/produtos/${id}`, {
		method: "PATCH",
		body: JSON.stringify(fields),
	});
	return mapProduto(data);
}
