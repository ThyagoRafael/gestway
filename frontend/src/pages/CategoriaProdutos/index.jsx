import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiSearch, FiFilter } from "react-icons/fi";
import { getProdutos } from "../../services/produtos";
import { useCarrinho } from "../../contexts/CarrinhoContext";
import styles from "./CategoriaProdutos.module.css";

const BRL = (v) => Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ProdutoCard({ produto, onAdicionar }) {
	const temDesconto = produto.precoOld && produto.precoOld > produto.preco;
	const pct = temDesconto ? Math.round((1 - produto.preco / produto.precoOld) * 100) : 0;
	const economia = temDesconto ? produto.precoOld - produto.preco : 0;
	const indisponivel = produto.status === "indisponivel";

	return (
		<div className={`${styles.card} ${indisponivel ? styles.cardIndisponivel : ""}`}>
			<div className={styles.cardImg}>
				{pct > 0 && <span className={styles.cardBadge}>{pct}% OFF</span>}
				{produto.imagem
					? <img src={produto.imagem} alt={produto.nome}/>
					: <div className={styles.cardImgPlaceholder}>{produto.nome.charAt(0)}</div>
				}
			</div>
			<div className={styles.cardInfo}>
				<p className={styles.cardNome}>{produto.nome}</p>
				{produto.descricao && <p className={styles.cardDesc}>{produto.descricao}</p>}
				<div className={styles.cardPrecos}>
					<span className={styles.cardPreco}>{BRL(produto.preco)}</span>
					{temDesconto && <span className={styles.cardPrecoOld}>{BRL(produto.precoOld)}</span>}
				</div>
				{economia > 0 && <p className={styles.cardEconomia}>Economize {BRL(economia)}</p>}
				{indisponivel
					? <p className={styles.cardIndisponivelLabel}>Indisponível</p>
					: (
						<button className={styles.cardBtn} onClick={() => onAdicionar(produto)}>
							<FiShoppingCart size={14}/> Adicionar ao carrinho
						</button>
					)
				}
			</div>
		</div>
	);
}

export default function CategoriaProdutos() {
	const { categoria }     = useParams();
	const navigate          = useNavigate();
	const { adicionar, qtdTotal } = useCarrinho();

	const [produtos,  setProdutos]  = useState([]);
	const [loading,   setLoading]   = useState(true);
	const [erro,      setErro]      = useState(null);
	const [busca,     setBusca]     = useState("");
	const [ordem,     setOrdem]     = useState("padrao");
	const [toast,     setToast]     = useState(null);

	const nomeCategoria = decodeURIComponent(categoria);

	useEffect(() => {
		setLoading(true);
		setErro(null);
		getProdutos()
			.then(todos => {
				const filtrados = todos.filter(p =>
					p.categoria?.toLowerCase() === nomeCategoria.toLowerCase()
				);
				setProdutos(filtrados);
			})
			.catch(e => setErro(e.message))
			.finally(() => setLoading(false));
	}, [nomeCategoria]);

	const handleAdicionar = (produto) => {
		adicionar(produto.id, 1);
		setToast(`${produto.nome} adicionado!`);
		setTimeout(() => setToast(null), 2500);
	};

	// filtro + ordenação
	let exibidos = produtos.filter(p =>
		p.nome.toLowerCase().includes(busca.toLowerCase()) ||
		(p.descricao || "").toLowerCase().includes(busca.toLowerCase())
	);

	if (ordem === "menor")    exibidos = [...exibidos].sort((a,b) => Number(a.preco) - Number(b.preco));
	if (ordem === "maior")    exibidos = [...exibidos].sort((a,b) => Number(b.preco) - Number(a.preco));
	if (ordem === "az")       exibidos = [...exibidos].sort((a,b) => a.nome.localeCompare(b.nome));
	if (ordem === "promocao") exibidos = [...exibidos].sort((a,b) => (b.precoOld ? 1 : 0) - (a.precoOld ? 1 : 0));

	const emPromocao   = exibidos.filter(p => p.precoOld && p.precoOld > p.preco);
	const semPromocao  = exibidos.filter(p => !p.precoOld || p.precoOld <= p.preco);

	return (
		<div className={styles.page}>
			{/* header */}
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<button className={styles.backBtn} onClick={() => navigate("/")}>
						<FiArrowLeft size={15}/> Voltar
					</button>
					<h1 className={styles.titulo}>{nomeCategoria}</h1>
					<button className={styles.carrinhoBtn} onClick={() => navigate("/carrinho")}>
						<FiShoppingCart size={18}/>
						{qtdTotal > 0 && <span className={styles.carrinhoBadge}>{qtdTotal}</span>}
					</button>
				</div>
			</header>

			{/* barra de filtros */}
			<div className={styles.filtros}>
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon}/>
					<input
						className={styles.busca}
						placeholder={`Buscar em ${nomeCategoria}...`}
						value={busca}
						onChange={e => setBusca(e.target.value)}
					/>
				</div>
				<div className={styles.ordemWrap}>
					<FiFilter size={14}/>
					<select value={ordem} onChange={e => setOrdem(e.target.value)} className={styles.ordemSelect}>
						<option value="padrao">Ordenar por</option>
						<option value="promocao">Promoções primeiro</option>
						<option value="menor">Menor preço</option>
						<option value="maior">Maior preço</option>
						<option value="az">A-Z</option>
					</select>
				</div>
				<span className={styles.total}>{exibidos.length} produto{exibidos.length !== 1 ? "s" : ""}</span>
			</div>

			{/* conteúdo */}
			<main className={styles.main}>
				{loading && <p className={styles.info}>Carregando produtos...</p>}
				{erro    && <p className={styles.erro}>Erro: {erro}</p>}

				{!loading && !erro && exibidos.length === 0 && (
					<div className={styles.vazioWrap}>
						<p className={styles.vazioTitulo}>Nenhum produto encontrado</p>
						<p className={styles.vazioDes}>Tente outro termo de busca ou volte mais tarde.</p>
					</div>
				)}

				{!loading && !erro && emPromocao.length > 0 && (
					<section className={styles.secao}>
						<div className={styles.secaoHeader}>
							<h2>Em promoção</h2>
							<div className={styles.secaoLinha}/>
						</div>
						<div className={styles.grid}>
							{emPromocao.map(p => (
								<ProdutoCard key={p.id} produto={p} onAdicionar={handleAdicionar}/>
							))}
						</div>
					</section>
				)}

				{!loading && !erro && semPromocao.length > 0 && (
					<section className={styles.secao}>
						<div className={styles.secaoHeader}>
							<h2>{emPromocao.length > 0 ? "Outros produtos" : "Todos os produtos"}</h2>
							<div className={styles.secaoLinha}/>
						</div>
						<div className={styles.grid}>
							{semPromocao.map(p => (
								<ProdutoCard key={p.id} produto={p} onAdicionar={handleAdicionar}/>
							))}
						</div>
					</section>
				)}
			</main>

			{/* toast */}
			{toast && <div className={styles.toast}>{toast}</div>}
		</div>
	);
}
