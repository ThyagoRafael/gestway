import { useState } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiChevronDown,
         FiPhone, FiMail, FiInstagram, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./LandingPage.module.css";

// ── dados mock ─────────────────────────────────────────────────────────────
const CATEGORIAS_NAV = ["Eletrônicos", "Vestuários", "Licenças", "E-books", "Saúde"];

const PRODUTOS_ELETRONICOS = [
	{ id:1, nome:"Galaxy S22 Ultra",         preco:3900, precoOld:4099, economia:672, badge:"56% PROMO" },
	{ id:2, nome:"Galaxy M13 (4GB | 64 GB)", preco:1200, precoOld:1872, economia:672, badge:"56% PROMO" },
	{ id:3, nome:"Galaxy M33 (4GB | 64 GB)", preco:1200, precoOld:1872, economia:672, badge:"56% PROMO" },
	{ id:4, nome:"Galaxy M53 (4GB | 64 GB)", preco:1200, precoOld:1872, economia:672, badge:"56% PROMO" },
];

const PRODUTOS_EBOOKS = [
	{ id:5, nome:"Harry Potter",   preco:50, precoOld:100, economia:50, badge:"50% PROMO" },
	{ id:6, nome:"Fundação",       preco:50, precoOld:100, economia:50, badge:"50% PROMO" },
	{ id:7, nome:"Percy Jackson",  preco:50, precoOld:100, economia:50, badge:"50% PROMO" },
	{ id:8, nome:"O Tempo e o Vento", preco:50, precoOld:100, economia:50, badge:"50% PROMO" },
];

const MARCAS = [
	{ nome:"IPHONE",  cor:"#1c1c1e", desconto:"Até 40% OFF" },
	{ nome:"REALME",  cor:"#fef3c7", desconto:"Até 60% OFF", logoColor:"#f59e0b" },
	{ nome:"XIAOMI",  cor:"#fce7d6", desconto:"Até 80% OFF", logoColor:"#e86c30" },
];

const BRL = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

// ── card de produto ────────────────────────────────────────────────────────
function ProdutoCard({ produto, wide = false }) {
	return (
		<div className={`${styles.prodCard} ${wide ? styles.prodCardWide : ""}`}>
			<div className={styles.prodImgWrap}>
				<span className={styles.prodBadge}>{produto.badge}</span>
				<div className={styles.prodImg}><span>{produto.nome.charAt(0)}</span></div>
			</div>
			<div className={styles.prodInfo}>
				<p className={styles.prodNome}>{produto.nome}</p>
				<div className={styles.prodPrecos}>
					<span className={styles.prodPreco}>R$ {BRL(produto.preco)}</span>
					<span className={styles.prodPrecoOld}>R$ {BRL(produto.precoOld)}</span>
				</div>
				<p className={styles.prodEconomia}>Economize R$ {BRL(produto.economia)}</p>
			</div>
		</div>
	);
}

// ── voucher flutuante ──────────────────────────────────────────────────────
function VoucherFlutuante() {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className={`${styles.voucherFloat} ${expanded ? styles.voucherFloatOpen : ""}`}
			onClick={() => setExpanded(p => !p)}>
			<div className={styles.voucherFloatIcon}>🎟</div>
			{expanded && (
				<div className={styles.voucherFloatContent}>
					<p className={styles.voucherFloatTitle}>Voucher de Bem-Vindo!</p>
					<p className={styles.voucherFloatCode}><strong>BEMVINDO10</strong></p>
					<p className={styles.voucherFloatDesc}>10% OFF na sua primeira compra</p>
				</div>
			)}
		</div>
	);
}

// ── página ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
	const [busca, setBusca] = useState("");

	return (
		<div className={styles.page}>
			{/* ── header ─────────────────────────────────────────────── */}
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<div className={styles.logo}>
						<div className={styles.logoIcon}>G</div>
						<span>GestWay</span>
					</div>
					<div className={styles.buscaWrap}>
						<FiSearch size={16} className={styles.buscaIcon}/>
						<input className={styles.busca} placeholder="Pesquise o que deseja" value={busca} onChange={e=>setBusca(e.target.value)}/>
						<button className={styles.buscaMenuBtn}><FiMenu size={16}/></button>
					</div>
					<div className={styles.headerActions}>
						<button className={styles.headerBtn}><FiUser size={16}/> Login / Registro</button>
						<button className={styles.headerBtn}><FiShoppingCart size={16}/> Carrinho</button>
					</div>
				</div>
				{/* nav categorias */}
				<nav className={styles.nav}>
					{CATEGORIAS_NAV.map(c => (
						<button key={c} className={styles.navItem}>{c} <FiChevronDown size={12}/></button>
					))}
				</nav>
			</header>

			<main className={styles.main}>
				{/* ── banner hero ────────────────────────────────────── */}
				<section className={styles.heroSection}>
					{/* banner esquerdo */}
					<div className={styles.heroLeft}>
						<p className={styles.heroUpper}>As melhores ofertas de smartphones!</p>
						<h2 className={styles.heroTitulo}>SMARTPHONES</h2>
						<p className={styles.heroDesc}>Apple, Samsung, Xiaomi e mais!</p>
						<button className={styles.heroBtn}>Compre já!</button>
						<div className={styles.heroImgWrap}>
							<div className={styles.heroImgPlaceholder}/>
							<div className={styles.heroDesconto}>Até 50% de<br/>desconto!</div>
						</div>
					</div>
					{/* banner direito */}
					<div className={`${styles.heroRight}`}>
						<p className={styles.heroUpper}>Camisas de time? Também em promoção!</p>
						<h2 className={styles.heroTitulo}>Camisas<br/>esportivas</h2>
						<p className={styles.heroDesc}>Torça com estilo!</p>
						<button className={styles.heroBtn}>Compre já!</button>
						<div className={styles.heroImgWrap}>
							<div className={styles.heroImgPlaceholder}/>
							<div className={styles.heroDesconto}>Até 70% de<br/>desconto!</div>
						</div>
					</div>
				</section>

				{/* ── grid eletrônicos ────────────────────────────────── */}
				<section className={styles.gridSection}>
					<div className={styles.gridHeader}>
						<h3>As melhores promoções em <span className={styles.gridCat}>Eletrônicos</span></h3>
						<button className={styles.vejaBtn}>Veja mais <FiChevronRight size={14}/></button>
					</div>
					<div className={styles.gridLine}/>
					<div className={styles.prodGrid}>
						{PRODUTOS_ELETRONICOS.map(p => <ProdutoCard key={p.id} produto={p}/>)}
					</div>
				</section>

				{/* ── carrossel de marcas ──────────────────────────────── */}
				<section className={styles.gridSection}>
					<div className={styles.gridHeader}>
						<h3>As melhores marcas de <span className={styles.gridCat}>SMARTPHONES</span></h3>
						<button className={styles.vejaBtn}>Veja mais <FiChevronRight size={14}/></button>
					</div>
					<div className={styles.gridLine}/>
					<div className={styles.marcasGrid}>
						{MARCAS.map(m => (
							<div key={m.nome} className={styles.marcaCard} style={{background: m.cor}}>
								<div className={styles.marcaTag}>{m.nome}</div>
								<div className={styles.marcaLogoWrap}>
									<div className={styles.marcaLogo} style={{color: m.logoColor || "#fff"}}>
										{m.nome.charAt(0)}
									</div>
								</div>
								<p className={styles.marcaDesconto} style={{color: m.cor === "#1c1c1e" ? "#fff" : "#333"}}>{m.desconto}</p>
								<div className={styles.marcaImgPlaceholder}/>
							</div>
						))}
					</div>
					{/* dots carrossel */}
					<div className={styles.dots}>
						{[0,1,2,3,4,5,6].map(i => <span key={i} className={`${styles.dot} ${i===0?styles.dotAtivo:""}`}/>)}
					</div>
				</section>

				{/* ── grid e-books ─────────────────────────────────────── */}
				<section className={styles.gridSection}>
					<div className={styles.gridHeader}>
						<h3>As melhores promoções em <span className={styles.gridCat}>E-Books</span></h3>
						<button className={styles.vejaBtn}>Veja mais <FiChevronRight size={14}/></button>
					</div>
					<div className={styles.gridLine}/>
					<div className={styles.prodGrid}>
						{PRODUTOS_EBOOKS.map(p => <ProdutoCard key={p.id} produto={p} wide/>)}
					</div>
				</section>

				{/* ── banner voucher ───────────────────────────────────── */}
				<section className={styles.voucherBanner}>
					<div className={styles.voucherBannerBlob1}/>
					<div className={styles.voucherBannerBlob2}/>
					<p className={styles.voucherBannerTitle}>Voucher de Bem-Vindo!</p>
					<p className={styles.voucherBannerText}>10% OFF com o código <strong>BEMVINDO10</strong></p>
				</section>
			</main>

			{/* ── footer ─────────────────────────────────────────────── */}
			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<div className={styles.footerBrand}>
						<p className={styles.footerLogo}>GESTWAY</p>
						<div className={styles.footerContatos}>
							<p className={styles.footerContatosTitle}>Contatos</p>
							<div className={styles.footerContatoItem}><FaWhatsapp size={16}/><div><p>Whats App</p><p>(61) 4002-8922</p></div></div>
							<div className={styles.footerContatoItem}><FiPhone size={16}/><div><p>Telefone</p><p>(61) 4002-8922</p></div></div>
							<div className={styles.footerContatoItem}><FiMail size={16}/><p>gestway@suporte.com.br</p></div>
							<div className={styles.footerContatoItem}><FiInstagram size={16}/><p>gest.way</p></div>
						</div>
					</div>

					<div className={styles.footerLinks}>
						<div>
							<p className={styles.footerLinksTitle}>Categorias Populares</p>
							<div className={styles.footerLinkLine}/>
							{["Eletrônicos","Saúde","Vestuário","E-books","Cuidado pessoal","Artesanato"].map(c=>(
								<p key={c} className={styles.footerLink}>· {c}</p>
							))}
						</div>
						<div>
							<p className={styles.footerLinksTitle}>Saiba mais</p>
							<div className={styles.footerLinkLine}/>
							{["Sobre nós","Termos e Condições","FAQ","Políticas de Privacidade","Políticas de Cancelamento"].map(c=>(
								<p key={c} className={styles.footerLink}>· {c}</p>
							))}
						</div>
					</div>
				</div>

				<div className={styles.footerCopy}>
					© 2026 Todos os direitos reservados. GestWay.
				</div>
			</footer>

			{/* ── voucher flutuante ───────────────────────────────────── */}
			<VoucherFlutuante/>
		</div>
	);
}
