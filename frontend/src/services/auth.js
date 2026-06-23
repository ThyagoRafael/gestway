// ── serviço de autenticação ────────────────────────────────────────────────
// Troque API_BASE para a URL real quando o backend estiver em produção.

const API_BASE = "http://localhost:3000/api";

/**
 * Cadastra um novo usuário.
 * POST /auth/register
 * Body: { fullName, email, phoneNumber, password }
 * Retorna: { email }
 */
export async function register({ fullName, email, phoneNumber, password }) {
	const res = await fetch(`${API_BASE}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ fullName, email, phoneNumber, password }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? "Erro ao cadastrar.");
	return data;
}

/**
 * Faz login do usuário.
 * POST /auth/login
 * Body: { email, password }
 * Retorna: { user: { fullName, email }, token }
 */
export async function login({ email, password }) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? "Erro ao fazer login.");
	return data;
}

/**
 * Solicita reset de senha por e-mail.
 * POST /auth/forgot-password
 * Body: { email }
 */
export async function forgotPassword({ email }) {
	const res = await fetch(`${API_BASE}/auth/forgot-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? "Erro ao solicitar redefinição.");
	return data;
}

/**
 * Redefine a senha com o token recebido por e-mail.
 * POST /auth/reset-password
 * Body: { token, password }
 */
export async function resetPassword({ token, password }) {
	const res = await fetch(`${API_BASE}/auth/reset-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token, password }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? "Erro ao redefinir senha.");
	return data;
}

// ── helpers de sessão ──────────────────────────────────────────────────────
export function salvarSessao(token, user) {
	localStorage.setItem("gw_token", token);
	localStorage.setItem("gw_user", JSON.stringify(user));
}

export function limparSessao() {
	localStorage.removeItem("gw_token");
	localStorage.removeItem("gw_user");
}

export function getToken() {
	return localStorage.getItem("gw_token");
}

export function getUser() {
	const raw = localStorage.getItem("gw_user");
	return raw ? JSON.parse(raw) : null;
}

export function estaLogado() {
	return !!getToken();
}
