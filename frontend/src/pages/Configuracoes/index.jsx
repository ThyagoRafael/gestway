import { useState, useRef } from "react";
import { FiUpload, FiChevronDown } from "react-icons/fi";
import styles from "./Configuracoes.module.css";

// ── dados mock ─────────────────────────────────────────────────────────────
const CATEGORIAS = ["Eletrônicos", "E-books", "Vestuário", "Utilidades", "Serviços"];

const VOUCHERS_MOCK = [
	{ codigo: "BEMVIND0", porcentagem: "10%" },
	{ codigo: "NIVER15",  porcentagem: "15%" },
];

// ── componente de upload de imagem ─────────────────────────────────────────
function ImageUpload({ label, preview: initialPreview, small = false }) {
	const [preview, setPreview] = useState(initialPreview || null);
	const inputRef = useRef(null);

	const handleFile = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => setPreview(ev.target.result);
		reader.readAsDataURL(file);
	};

	return (
		<div className={`${styles.uploadArea} ${small ? styles.uploadSmall : ""}`}>
			<input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleFile}/>
			<div className={styles.uploadInner}>
				<button type="button" className={styles.uploadBtn} onClick={() => inputRef.current.click()}>
					<FiUpload size={13}/> Adicionar Imagem
				</button>
				<span className={styles.uploadHint}>(Formatos recomendados : JPG, PNG. Tamanho máx : 10MB)</span>
			</div>
			{preview && <img src={preview} alt="preview" className={styles.uploadPreview}/>}
		</div>
	);
}

// ── componente select ──────────────────────────────────────────────────────
function Select({ value, onChange, options }) {
	return (
		<div className={styles.selectWrap}>
			<select value={value} onChange={e => onChange(e.target.value)} className={styles.select}>
				{options.map(o => <option key={o} value={o}>{o}</option>)}
			</select>
			<FiChevronDown size={13} className={styles.selectIcon}/>
		</div>
	);
}

// ── componente grid de promoções ───────────────────────────────────────────
function GridPromocoes({ numero }) {
	const [titulo, setTitulo] = useState(`As melhores promoções em {categoria}`);
	const [categoria, setCategoria] = useState(CATEGORIAS[numero - 1] || CATEGORIAS[0]);

	return (
		<div className={styles.gridCard}>
			<p className={styles.gridLabel}>Grid {numero}</p>

			<div className={styles.formGroup}>
				<label>Título</label>
				<input
					value={titulo}
					onChange={e => setTitulo(e.target.value)}
					className={styles.input}
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Categoria</label>
				<Select value={categoria} onChange={setCategoria} options={CATEGORIAS}/>
			</div>

			{/* preview produtos */}
			<div className={styles.produtosPreview}>
				<div className={styles.produtoCard}>
					<div className={styles.produtoImgReal}>
						<span className={styles.produtoBadge}>Novo</span>
					</div>
					<div className={styles.produtoInfo}>
						<p className={styles.produtoNome}>Galaxy S22 Ultra</p>
						<p className={styles.produtoPrecoOld}>R$ 4.099,00</p>
						<p className={styles.produtoPreco}>R$ 3.900,00</p>
						<p className={styles.produtoEconomia}>Economize R$ 912,00</p>
					</div>
				</div>
				{[1,2,3].map(i => (
					<div key={i} className={styles.produtoCardEmpty}>
						<span className={styles.produtoPlus}>+</span>
						<div className={styles.produtoInfoEmpty}>
							<p>[Nome]</p>
							<p>R$ [Preço NA venda]</p>
							<p className={styles.produtoEconomia}>Economize R$ [PR OKDESC]</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── página principal ───────────────────────────────────────────────────────
export default function Configuracoes() {
	// 1. Identidade Visual
	const [corPrimaria,   setCorPrimaria]   = useState("#176FB8");
	const [corSecundaria, setCorSecundaria] = useState("#729AFF");

	// 2. Banners Hero
	const [banner1, setBanner1] = useState({
		titulo: "Smartphones",
		descUpper: "As melhores ofertas de smartphones",
		desc: "Apple, Samsung, Xiaomi e mais!",
	});
	const [banner2, setBanner2] = useState({
		titulo: "Camisas esportivas",
		descUpper: "Camisas de time? Também em promoção!",
		desc: "Torça com estilo!",
		desconto: "Até 50% de desconto!",
	});

	// 3. Banner Voucher
	const [exibirBanner,    setExibirBanner]    = useState(true);
	const [tituloVoucher,   setTituloVoucher]   = useState("Voucher de Bem-Vindo!");
	const [textoVoucher,    setTextoVoucher]    = useState('10% OFF com o código "BEMVINDO10"');
	const [voucherSel,      setVoucherSel]      = useState("");
	const [dropVoucher,     setDropVoucher]     = useState(false);

	const setBanner1Field = (k, v) => setBanner1(p => ({ ...p, [k]: v }));
	const setBanner2Field = (k, v) => setBanner2(p => ({ ...p, [k]: v }));

	const LIMITE_DESC_UPPER = 100;
	const LIMITE_DESC       = 64;
	const LIMITE_DESCONTO   = 64;

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Gestão &gt; Configurações</p>

			<h1 className={styles.titulo}>Edição do Site</h1>
			<p className={styles.subtitulo}>Gerencie o visual do conteúdo do seu site</p>

			{/* ── 1. Identidade Visual ─────────────────────────────────── */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>1. Identidade Visual e página inicial</h2>

				<div className={styles.identidadeCard}>
					{/* logotipo */}
					<div className={styles.logoArea}>
						<div className={styles.logoHeader}>
							<span className={styles.logoIcon}>👤</span>
							<span className={styles.logoLabel}>Logotipo da Loja</span>
						</div>
						<div className={styles.logoPreviewWrap}>
							<div className={styles.logoPreview}>
								<span className={styles.logoG}>G</span>
							</div>
						</div>
						<ImageUpload label="logo"/>
					</div>

					{/* cores */}
					<div className={styles.coresArea}>
						<h3 className={styles.coresTitle}>Cores da marca</h3>
						<div className={styles.corItem}>
							<span className={styles.corLabel}>Cor Primária</span>
							<div className={styles.corInputWrap}>
								<input type="color" value={corPrimaria} onChange={e => setCorPrimaria(e.target.value)} className={styles.corSwatch}/>
								<input type="text"  value={corPrimaria} onChange={e => setCorPrimaria(e.target.value)} className={styles.corText}/>
							</div>
						</div>
						<div className={styles.corItem}>
							<span className={styles.corLabel}>Cor Secundária</span>
							<div className={styles.corInputWrap}>
								<input type="color" value={corSecundaria} onChange={e => setCorSecundaria(e.target.value)} className={styles.corSwatch}/>
								<input type="text"  value={corSecundaria} onChange={e => setCorSecundaria(e.target.value)} className={styles.corText}/>
							</div>
						</div>
					</div>
				</div>

				{/* banner hero */}
				<div className={styles.bannerHeroWrap}>
					<h3 className={styles.bannerHeroTitle}>🖼 Banner Hero</h3>
					<div className={styles.bannersRow}>
						{/* banner 1 */}
						<div className={styles.bannerCard}>
							<p className={styles.bannerNumero}>1. Banner Esquerdo</p>

							<div className={styles.formGroup}>
								<label>Título</label>
								<input value={banner1.titulo} onChange={e => setBanner1Field("titulo", e.target.value)} className={styles.input}/>
							</div>

							<div className={styles.formGroup}>
								<label>Texto de descrição (upper)</label>
								<div className={styles.textareaWrap}>
									<textarea value={banner1.descUpper} onChange={e => e.target.value.length <= LIMITE_DESC_UPPER && setBanner1Field("descUpper", e.target.value)} className={styles.textarea} rows={3}/>
									<span className={styles.charCount}>{banner1.descUpper.length}/{LIMITE_DESC_UPPER}</span>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label>Texto de descrição</label>
								<div className={styles.textareaWrap}>
									<textarea value={banner1.desc} onChange={e => e.target.value.length <= LIMITE_DESC && setBanner1Field("desc", e.target.value)} className={styles.textarea} rows={3}/>
									<span className={styles.charCount}>{banner1.desc.length}/{LIMITE_DESC}</span>
								</div>
							</div>

							<ImageUpload label="banner1"/>
						</div>

						{/* banner 2 */}
						<div className={styles.bannerCard}>
							<p className={styles.bannerNumero}>2. Banner Direito</p>

							<div className={styles.formGroup}>
								<label>Título</label>
								<input value={banner2.titulo} onChange={e => setBanner2Field("titulo", e.target.value)} className={styles.input}/>
							</div>

							<div className={styles.formGroup}>
								<label>Texto de descrição (upper)</label>
								<div className={styles.textareaWrap}>
									<textarea value={banner2.descUpper} onChange={e => e.target.value.length <= LIMITE_DESC_UPPER && setBanner2Field("descUpper", e.target.value)} className={styles.textarea} rows={3}/>
									<span className={styles.charCount}>{banner2.descUpper.length}/{LIMITE_DESC_UPPER}</span>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label>Texto de descrição</label>
								<div className={styles.textareaWrap}>
									<textarea value={banner2.desc} onChange={e => e.target.value.length <= LIMITE_DESC && setBanner2Field("desc", e.target.value)} className={styles.textarea} rows={3}/>
									<span className={styles.charCount}>{banner2.desc.length}/{LIMITE_DESC}</span>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label>Texto de desconto</label>
								<div className={styles.textareaWrap}>
									<input value={banner2.desconto} onChange={e => e.target.value.length <= LIMITE_DESCONTO && setBanner2Field("desconto", e.target.value)} className={styles.input}/>
									<span className={styles.charCountInline}>{banner2.desconto?.length || 0}/{LIMITE_DESCONTO}</span>
								</div>
							</div>

							<ImageUpload label="banner2"/>
						</div>
					</div>
				</div>
			</section>

			{/* ── 2. Grids de Promoções ────────────────────────────────── */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>2. Grids de Promoções e Destaques</h2>
				<div className={styles.gridsWrap}>
					<GridPromocoes numero={1}/>
					<GridPromocoes numero={2}/>
				</div>
			</section>

			{/* ── 3. Banner de Voucher ─────────────────────────────────── */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>3. Banner de Voucher</h2>

				<div className={styles.voucherBannerCard}>
					<div className={styles.voucherLeft}>
						{/* toggle exibir */}
						<div className={styles.toggleRow}>
							<span className={styles.toggleLabel}>Exibir banner</span>
							<button
								type="button"
								className={`${styles.toggle} ${exibirBanner ? styles.toggleOn : ""}`}
								onClick={() => setExibirBanner(p => !p)}
							>
								<span className={styles.toggleThumb}/>
							</button>
						</div>

						<div className={styles.formGroup}>
							<label>Título</label>
							<input value={tituloVoucher} onChange={e => setTituloVoucher(e.target.value)} className={styles.input}/>
						</div>

						<div className={styles.formGroup}>
							<label>Texto descritivo</label>
							<textarea value={textoVoucher} onChange={e => setTextoVoucher(e.target.value)} className={styles.textarea} rows={3}/>
						</div>
					</div>

					{/* seletor de voucher */}
					<div className={styles.voucherRight}>
						<label className={styles.voucherSelLabel}>Selecione o Voucher</label>
						<div style={{ position: "relative" }}>
							<button
								type="button"
								className={styles.voucherSelBtn}
								onClick={() => setDropVoucher(p => !p)}
							>
								{voucherSel || ""} <FiChevronDown size={13}/>
							</button>
							{dropVoucher && (
								<div className={styles.voucherDrop}>
									<div className={styles.voucherDropHeader}>
										<span>Código</span>
										<span>Porcentagem</span>
									</div>
									{VOUCHERS_MOCK.map(v => (
										<button
											key={v.codigo}
											type="button"
											className={`${styles.voucherDropItem} ${voucherSel === v.codigo ? styles.voucherDropItemSel : ""}`}
											onClick={() => { setVoucherSel(v.codigo); setDropVoucher(false); }}
										>
											<span>{v.codigo}</span>
											<span>{v.porcentagem}</span>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* ── botões de ação ───────────────────────────────────────── */}
			<div className={styles.acoes}>
				<button type="button" className={styles.btnVisualizar}>Visualizar Site</button>
				<button type="button" className={styles.btnSalvar}>Salvar Alterações</button>
			</div>
		</main>
	);
}
