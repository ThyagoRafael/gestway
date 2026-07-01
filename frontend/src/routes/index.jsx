import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage   from "../pages/LandingPage";
import MainLayout    from "../templates/MainLayout";
import SidebarLayout from "../templates/SidebarLayout";
import PrivateRoute  from "../components/PrivateRoute";

import Dashboard     from "../pages/Dashboard";
import Cadastrar     from "../pages/Auth/Cadastrar";
import Entrar        from "../pages/Auth/Entrar";
import EsqueceuSenha from "../pages/Auth/EsqueceuSenha";
import RedefinirSenha from "../pages/Auth/RedefinirSenha";

import Vendas        from "../pages/Vendas";
import Vendedores    from "../pages/Vendedores";
import Produtos      from "../pages/Produtos";
import Categorias    from "../pages/Categorias";
import Movimentacoes from "../pages/Movimentacoes";
import Relatorios    from "../pages/Relatorios";
import Vouchers      from "../pages/Vouchers";
import Configuracoes from "../pages/Configuracoes";
import Perfil              from "../pages/Perfil";
import CategoriaProdutos    from "../pages/CategoriaProdutos";
import Carrinho             from "../pages/Carrinho";

export default function Router() {
	return (
		<Routes>
			{/* Landing page pública */}
			<Route path="/" element={<LandingPage />} />
			<Route path="/categoria/:categoria" element={<CategoriaProdutos />} />
			<Route path="/carrinho" element={<Carrinho />} />

			{/* Rotas de autenticação — sem sidebar */}
			<Route element={<MainLayout />}>
				<Route path="entrar"          element={<Entrar />} />
				<Route path="cadastrar"       element={<Cadastrar />} />
				<Route path="esqueceu-senha"  element={<EsqueceuSenha />} />
				<Route path="redefinir-senha" element={<RedefinirSenha />} />
			</Route>

			{/* Rotas protegidas — exigem login */}
			<Route element={<PrivateRoute />}>
				<Route element={<SidebarLayout />}>
					<Route path="dashboard" element={<Dashboard />} />

					<Route path="operacional">
						<Route index element={<Navigate to="vendas" replace />} />
						<Route path="vendas"      element={<Vendas />} />
						<Route path="vendedores"  element={<Vendedores />} />
					</Route>

					<Route path="estoque">
						<Route index element={<Navigate to="produtos" replace />} />
						<Route path="produtos"      element={<Produtos />} />
						<Route path="categorias"    element={<Categorias />} />
						<Route path="movimentacoes" element={<Movimentacoes />} />
					</Route>

					<Route path="gestao">
						<Route index element={<Navigate to="relatorios" replace />} />
						<Route path="relatorios"   element={<Relatorios />} />
						<Route path="vouchers"     element={<Vouchers />} />
						<Route path="configuracoes" element={<Configuracoes />} />
					</Route>

					<Route path="perfil" element={<Perfil />} />
				</Route>
			</Route>

			{/* Qualquer rota desconhecida → landing */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
