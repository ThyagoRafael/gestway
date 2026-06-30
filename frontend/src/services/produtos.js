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
	return {
		id:            p.id_produto,
		nome:          p.nome_produto,
		preco:         p.preco_produto ?? "0",
		descricao:     p.descricao_produto ?? "",
		estoqueInicial: p.estoque_inicial_produto,
		estoqueMinimo: p.estoque_minimo_produto,
		estoqueAtual: p.estoque_atual_produto,
		idCategoria:   p.id_categoria,
		categoria:     p.categoria?.nome_categoria ?? "",
		status:        calcStatus(p.estoque_inicial_produto),
		imagem:        p.imagem_produto,
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
export async function createProduto(formData) {
	const data = await apiFetch("/produtos", {
		method: "POST",
		body: formData,
	});
	return mapProduto(data);
}

/**
 * PATCH /api/produtos/:id  — exige token
 * Campos opcionais: name, price, description, idCategoria, stock
 * Atualizar stock gera movimentação automática no backend.
 */
export async function updateProduto(id, fields) {
	for (const [key, value] of fields.entries()) {
		console.log(key, value);
	}

	const data = await apiFetch(`/produtos/${id}`, {
		method: "PATCH",
		body: fields,
	});
	return mapProduto(data);
}
