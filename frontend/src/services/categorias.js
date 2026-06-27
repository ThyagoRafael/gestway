import { apiFetch } from "./api";

// Backend retorna: id_categoria, nome_categoria, descricao_categoria,
//                  data_criacao_categoria, data_atualizacao_categoria
// Nota: todas as rotas exigem authMiddleware + adminMiddleware

function mapCategoria(c) {
	return {
		id:           c.id_categoria,
		nome:         c.nome_categoria,
		descricao:    c.descricao_categoria ?? "",
		// total de produtos não vem da listagem — mantemos 0 até o backend expor
		totalProdutos: c._count?.produto ?? 0,
		status:       "disponivel", // backend não expõe status de categoria ainda
		imagem:       null,
	};
}

/** GET /api/categorias */
export async function getCategorias() {
	const data = await apiFetch("/categorias");
	return data.map(mapCategoria);
}

/** POST /api/categorias — { name, description } */
export async function createCategoria({ name, description }) {
	const data = await apiFetch("/categorias", {
		method: "POST",
		body: JSON.stringify({ name, description }),
	});
	return mapCategoria(data);
}

/** PATCH /api/categorias/:id — campos opcionais: name, description */
export async function updateCategoria(id, { name, description }) {
	const data = await apiFetch(`/categorias/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ name, description }),
	});
	return mapCategoria(data);
}
