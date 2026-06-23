// ── components/PrivateRoute/index.jsx ─────────────────────────────────────
// Protege rotas autenticadas. Se não tiver token, redireciona para /entrar.

import { Navigate, Outlet } from "react-router-dom";
import { estaLogado } from "../../services/auth";

export default function PrivateRoute() {
	if (!estaLogado()) {
		return <Navigate to="/entrar" replace />;
	}
	return <Outlet />;
}
