import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../templates/MainLayout";
import SidebarLayout from "../templates/SidebarLayout";
import Dashboard from "../pages/Dashboard";
import Cadastrar from "../pages/Auth/Cadastrar";
import Entrar from "../pages/Auth/Entrar";
import Vendas from "../pages/Vendas";
import Vendedores from "../pages/Vendedores";
import Produtos from "../pages/Produtos";
import Categorias from "../pages/Categorias";
import Movimentacoes from "../pages/Movimentacoes";
import Relatorios from "../pages/Relatorios";
import Vouchers from "../pages/Vouchers";
import Configuracoes from "../pages/Configuracoes";
import Perfil from "../pages/Perfil";
import EsqueceuSenha from "../pages/Auth/EsqueceuSenha";
import RedefinirSenha from "../pages/Auth/RedefinirSenha";

export default function Router() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route
					path="entrar"
					element={<Entrar />}
				/>

				<Route
					path="cadastrar"
					element={<Cadastrar />}
				/>

				<Route
					path="esqueceu-senha"
					element={<EsqueceuSenha />}
				/>

				<Route
					path="redefinir-senha"
					element={<RedefinirSenha />}
				/>

				<Route element={<SidebarLayout />}>
					<Route
						path="dashboard"
						element={<Dashboard />}
					/>

					<Route path="operacional">
						<Route
							index
							element={
								<Navigate
									to="vendas"
									replace
								/>
							}
						/>

						<Route
							path="vendas"
							element={<Vendas />}
						/>

						<Route
							path="vendedores"
							element={<Vendedores />}
						/>
					</Route>

					<Route path="estoque">
						<Route
							index
							element={
								<Navigate
									to="produtos"
									replace
								/>
							}
						/>

						<Route
							path="produtos"
							element={<Produtos />}
						/>

						<Route
							path="categorias"
							element={<Categorias />}
						/>

						<Route
							path="movimentacoes"
							element={<Movimentacoes />}
						/>
					</Route>

					<Route path="gestao">
						<Route
							index
							element={
								<Navigate
									to="relatorios"
									replace
								/>
							}
						/>

						<Route
							path="relatorios"
							element={<Relatorios />}
						/>

						<Route
							path="vouchers"
							element={<Vouchers />}
						/>

						<Route
							path="configuracoes"
							element={<Configuracoes />}
						/>
					</Route>

					<Route
						path="perfil"
						element={<Perfil />}
					/>
				</Route>
			</Route>

			<Route
				path="*"
				element={
					<Navigate
						to="/dashboard"
						replace
					/>
				}
			/>
		</Routes>
	);
}
