import { FaBox, FaChartBar, FaClipboard, FaShoppingCart, FaUser } from "react-icons/fa";
import { FaGear, FaRightLeft, FaTicket, FaArrowRightFromBracket } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import NavItem from "../../components/NavItem";
import { limparSessao, getUser } from "../../services/auth";
import fotoPerfil from "../../assets/default-user.jpg";
import styles from "./SidebarLayout.module.css";

export default function SidebarLayout() {
	const navigate = useNavigate();
	const user = getUser();

	const handleSair = () => {
		limparSessao();
		navigate("/entrar");
	};

	return (
		<div className={styles.wrapper}>
			<aside className={styles.sidebar}>
				<header>
					<img src="/logo.png" alt="Logo Gestway" />
					<span>GestWay</span>
				</header>

				<nav>
					<ul>
						<li>
							<NavItem to="/dashboard">
								<FaChartBar />
								<span>Dashboard</span>
							</NavItem>
						</li>
					</ul>

					<section>
						<h2>Operacional</h2>
						<ul>
							<li><NavItem to="/operacional/vendas"><FaShoppingCart /><span>Vendas</span></NavItem></li>
							<li><NavItem to="/operacional/vendedores"><FaUser /><span>Vendedores</span></NavItem></li>
						</ul>
					</section>

					<section>
						<h2>Estoque</h2>
						<ul>
							<li><NavItem to="/estoque/produtos"><FaBox /><span>Produtos</span></NavItem></li>
							<li><NavItem to="/estoque/categorias"><BiSolidCategoryAlt /><span>Categorias</span></NavItem></li>
							<li><NavItem to="/estoque/movimentacoes"><FaRightLeft /><span>Movimentações</span></NavItem></li>
						</ul>
					</section>

					<section>
						<h2>Gestão</h2>
						<ul>
							<li><NavItem to="/gestao/relatorios"><FaClipboard /><span>Relatórios</span></NavItem></li>
							<li><NavItem to="/gestao/vouchers"><FaTicket /><span>Vouchers</span></NavItem></li>
							<li><NavItem to="/gestao/configuracoes"><FaGear /><span>Configurações</span></NavItem></li>
						</ul>
					</section>
				</nav>

				<footer>
					<Link to="/perfil" className={styles.userLink}>
						<img src={fotoPerfil} alt="Foto de perfil do usuário" />
						<div className={styles["user-details"]}>
							<p>{user?.nome_completo_usuario ?? user?.name ?? "Usuário"}</p>
							<span>{user?.email ?? ""}</span>
						</div>
					</Link>

					<button className={styles.sairBtn} onClick={handleSair}>
						<FaArrowRightFromBracket size={14} />
						<span>Sair</span>
					</button>
				</footer>
			</aside>

			<div className={styles.content}>
				<Outlet />
			</div>
		</div>
	);
}
