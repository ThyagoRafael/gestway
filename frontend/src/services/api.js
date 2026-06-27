// ── cliente HTTP centralizado ────────────────────────────────────────────────
// Toda chamada autenticada passa por aqui. Se precisar trocar a base URL,
// mude só esta constante (ou use import.meta.env.VITE_API_URL no Vite).

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

/**
 * Wrapper sobre fetch que:
 * - Injeta o token JWT automaticamente quando existe
 * - Lança um Error com a mensagem do backend em caso de !res.ok
 */
export async function apiFetch(path, options = {}) {
	const token = localStorage.getItem("gw_token");

	const headers = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...options.headers,
	};

	const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

	// respostas sem corpo (204)
	if (res.status === 204) return null;

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? "Erro inesperado.");
	return data;
}
