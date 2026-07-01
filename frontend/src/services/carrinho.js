import { apiFetch } from "./api";

// ── GET /api/carrinho ────────────────────────────────────────────────────────
// Retorna { id, status, itens, total, qtdTotal }
export async function getCarrinho() {
	return apiFetch("/carrinho");
}

// ── POST /api/carrinho/itens ─────────────────────────────────────────────────
// { idProduto: number, quantidade: number }
export async function addItem(idProduto, quantidade = 1) {
	return apiFetch("/carrinho/itens", {
		method: "POST",
		body: JSON.stringify({ idProduto, quantidade }),
	});
}

// ── PATCH /api/carrinho/itens/:idProduto ─────────────────────────────────────
// { quantidade: number } — 0 remove o item
export async function updateItem(idProduto, quantidade) {
	return apiFetch(`/carrinho/itens/${idProduto}`, {
		method: "PATCH",
		body: JSON.stringify({ quantidade }),
	});
}

// ── DELETE /api/carrinho/itens/:idProduto ────────────────────────────────────
export async function removeItem(idProduto) {
	return apiFetch(`/carrinho/itens/${idProduto}`, { method: "DELETE" });
}

// ── DELETE /api/carrinho — limpa tudo ────────────────────────────────────────
export async function clearCarrinho() {
	return apiFetch("/carrinho", { method: "DELETE" });
}
