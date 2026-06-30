import { useState } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiChevronDown,
         FiPhone, FiMail, FiInstagram, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useConfig } from "../../contexts/ConfigContext";
import styles from "./LandingPage.module.css";

const BRL = (v) => Number(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const MARCAS = [
	{ nome:"IPHONE", cor:"#1c1c1e", desconto:"Até 40% OFF" },
	{ nome:"REALME", cor:"#fef3c7", desconto:"Até 60% OFF", logoColor:"#f59e0b" },
	{ nome:"XIAOMI", cor:"#fce7d6", desconto:"Até 80% OFF", logoColor:"#e86c30" },
];

// ── card de produto ────────────────────────────────────────────────────────
function ProdutoCard({ produto, wide = false }) {
	if (!produto) return null;
	const economia = produto.precoOld ? produto.precoOld - produto.preco : 0;
	const pct = produto.precoOld ? Math.round((1 - produto.preco / produto.precoOld) * 100) : 0;
	return (
		<div className={`${styles.prodCard} ${wide ? styles.prodCardWide : ""}`}>
			<div className={styles.prodImgWrap}>
				{pct > 0 && <span className={styles.prodBadge} style={{background: corSecundaria}}>{pct}% PROMO</span>}
				{produto.imagem
					? <img src={produto.imagem} alt={produto.nome} className={styles.prodImgReal}/>
					: <div className={styles.prodImg}><span>{produto.nome.charAt(0)}</span></div>
				}
			</div>
			<div className={styles.prodInfo}>
				<p className={styles.prodNome}>{produto.nome}</p>
				<div className={styles.prodPrecos}>
					<span className={styles.prodPreco}>R$ {BRL(produto.preco)}</span>
					{produto.precoOld && <span className={styles.prodPrecoOld}>R$ {BRL(produto.precoOld)}</span>}
				</div>
				{economia > 0 && <p className={styles.prodEconomia}>Economize R$ {BRL(economia)}</p>}
			</div>
		</div>
	);
}

// ── voucher flutuante ──────────────────────────────────────────────────────
function VoucherFlutuante({ titulo, texto, voucher }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className={`${styles.voucherFloat} ${expanded ? styles.voucherFloatOpen : ""}`}
			onClick={() => setExpanded(p => !p)}>
			<div className={styles.voucherFloatIcon}>🎟</div>
			{expanded && (
				<div className={styles.voucherFloatContent}>
					<p className={styles.voucherFloatTitle}>{titulo}</p>
					{voucher && <p className={styles.voucherFloatCode}><strong>{voucher.codigo}</strong></p>}
					<p className={styles.voucherFloatDesc}>{texto}</p>
				</div>
			)}
		</div>
	);
}

// ── página ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
	const { config } = useConfig();
	const [busca, setBusca] = useState("");

	const { banner1, banner2, grid1, grid2, exibirBanner,
	        tituloVoucher, textoVoucher, voucherSel, corPrimaria, corSecundaria } = config;

	// produtos dos slots (filtra nulls)
	const prodGrid1 = grid1.slots.filter(Boolean);
	const prodGrid2 = grid2.slots.filter(Boolean);

	return (
		<div className={styles.page}>
			{/* ── header ──────────────────────────────────────────────── */}
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<div className={styles.logo}>
						<div className={styles.logoIcon} style={{background: corSecundaria}}>G</div>
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
				<nav className={styles.nav}>
					{["Eletrônicos","Vestuários","Licenças","E-books","Saúde"].map(c => (
						<button key={c} className={styles.navItem}>{c} <FiChevronDown size={12}/></button>
					))}
				</nav>
			</header>

			<main className={styles.main}>
				{/* ── banner hero ─────────────────────────────────────── */}
				<section className={styles.heroSection}>
					<div className={styles.heroLeft} style={{background: corPrimaria}}>
						<p className={styles.heroUpper}>{banner1.descUpper}</p>
						<h2 className={styles.heroTitulo}>{banner1.titulo.toUpperCase()}</h2>
						<p className={styles.heroDesc}>{banner1.desc}</p>
						<button className={styles.heroBtn}>Compre já!</button>
						<div className={styles.heroImgWrap}>
							{banner1.imagem
								? <img src={banner1.imagem} alt="banner1" className={styles.heroImgReal}/>
								: <div className={styles.heroImgPlaceholder}/>
							}
							{banner1.desconto && <div className={styles.heroDesconto}>{banner1.desconto}</div>}
						</div>
					</div>
					<div className={styles.heroRight} style={{background: corSecundaria}}>
						<p className={styles.heroUpper}>{banner2.descUpper}</p>
						<h2 className={styles.heroTitulo}>{banner2.titulo}</h2>
						<p className={styles.heroDesc}>{banner2.desc}</p>
						<button className={styles.heroBtn}>Compre já!</button>
						<div className={styles.heroImgWrap}>
							{banner2.imagem
								? <img src={banner2.imagem} alt="banner2" className={styles.heroImgReal}/>
								: <div className={styles.heroImgPlaceholder}/>
							}
							{banner2.desconto && <div className={styles.heroDesconto}>{banner2.desconto}</div>}
						</div>
					</div>
				</section>

				{/* ── grid 1 ──────────────────────────────────────────── */}
				<section className={styles.gridSection}>
					<div className={styles.gridHeader}>
						<h3>{grid1.titulo.replace("{categoria}", "")} <span className={styles.gridCat} style={{color: corSecundaria}}>{grid1.categoria}</span></h3>
						<button className={styles.vejaBtn}>Veja mais <FiChevronRight size={14}/></button>
					</div>
					<div className={styles.gridLine} style={{background: corPrimaria}}/>
					<div className={styles.prodGrid}>
						{prodGrid1.length > 0
							? prodGrid1.map((p, i) => <ProdutoCard key={i} produto={p}/>)
							: <p style={{fontSize:"0.875rem",color:"#888"}}>Nenhum produto adicionado. Configure em Configurações → Grid 1.</p>
						}
					</div>
				</section>

				{/* ── carrossel de marcas ──────────────────────────────── */}
				<section className={styles.gridSection}>
					<div className={styles.gridHeader}>
						<h3>As melhores marcas de <span className={styles.gridCat}  style={{color: corSecundaria}}>SMARTPHONES</span></h3>
						<button className={styles.vejaBtn}>Veja mais <FiChevronRight size={14}/></button>
					</div>
					<div className={styles.gridLine} style={{background: corPrimaria}}/>
					<div className={styles.marcasGrid}>
						{MARCAS.map(m => (
							<div key={m.nome} className={styles.marcaCard} style={{background: m.cor}}>
								<div className={styles.marcaTag}>{m.nome}</div>
								<div className={styles.marcaLogoWrap}>
									<div className={styles.marcaLogo} style={{color: m.logoColor||"#fff"}}>{m.nome.charAt(0)}</div>
								</div>
								<p className={styles.marcaDesconto} style={{color: m.cor==="#1c1c1e"?"#fff":"#333"}}>{m.desconto}</p>
								<div className={styles.marcaImgPlaceholder}/>
							</div>
						))}
					</div>
					<div className={styles.dots}>
						{[0,1,2,3,4,5,6].map(i=><span key={i} className={`${styles.dot} ${i===0?styles.dotAtivo:""}`} style={i===0?{background:corPrimaria}:{}}/>)}
					</div>
				</section>

				{/* ── grid 2 ──────────────────────────────────────────── */}
				<section className={styles.gridSection}>
					<div className={styles.gridHeader}>
						<h3>{grid2.titulo.replace("{categoria}", "")} <span className={styles.gridCat}  style={{color: corSecundaria}}>{grid2.categoria}</span></h3>
						<button className={styles.vejaBtn}>Veja mais <FiChevronRight size={14}/></button>
					</div>
					<div className={styles.gridLine} style={{background: corPrimaria}}/>
					<div className={styles.prodGrid}>
						{prodGrid2.length > 0
							? prodGrid2.map((p, i) => <ProdutoCard key={i} produto={p} wide/>)
							: <p style={{fontSize:"0.875rem",color:"#888"}}>Nenhum produto adicionado. Configure em Configurações → Grid 2.</p>
						}
					</div>
				</section>

				{/* ── banner voucher ───────────────────────────────────── */}
				{exibirBanner && (
					<section className={styles.voucherBanner} style={{background: corPrimaria}}>
						<div className={styles.voucherBannerBlob1}/>
						<div className={styles.voucherBannerBlob2}/>
						<p className={styles.voucherBannerTitle}>{tituloVoucher}</p>
						<p className={styles.voucherBannerText}>
							{textoVoucher}
							{voucherSel && <strong> {voucherSel.codigo}</strong>}
						</p>
					</section>
				)}
			</main>

			{/* ── footer ──────────────────────────────────────────────── */}
			<footer className={styles.footer} style={{background: corPrimaria}}>
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
				<div className={styles.footerCopy}>© 2026 Todos os direitos reservados. GestWay.</div>
			</footer>

			{/* ── voucher flutuante ────────────────────────────────────── */}
			<VoucherFlutuante titulo={tituloVoucher} texto={textoVoucher} voucher={voucherSel}/>
		</div>
	);
}
