// ── serviço de autenticação ────────────────────────────────────────────────
import { apiFetch } from "./api";

/** POST /auth/register */
export async function register({ fullName, email, phoneNumber, password }) {
	return apiFetch("/auth/register", {
		method: "POST",
		body: JSON.stringify({ fullName, email, phoneNumber, password }),
	});
}

/** POST /auth/login → { user, token } */
export async function login({ email, password }) {
	return apiFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

/** POST /auth/forgot-password → envia e-mail com link de reset */
export async function forgotPassword({ email }) {
	return apiFetch("/auth/forgot-password", {
		method: "POST",
		body: JSON.stringify({ email }),
	});
}

/** POST /auth/reset-password → { token, password } */
export async function resetPassword({ token, password }) {
	return apiFetch("/auth/reset-password", {
		method: "POST",
		body: JSON.stringify({ token, password }),
	});
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

export function getToken()   { return localStorage.getItem("gw_token"); }
export function getUser()    { const r = localStorage.getItem("gw_user"); return r ? JSON.parse(r) : null; }
export function estaLogado() { return !!getToken(); }
