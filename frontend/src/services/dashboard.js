import { apiFetch } from "./api";

export async function getDashboard() {
	return apiFetch("/dashboard");
}
