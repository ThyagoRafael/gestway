import { useState, useRef } from "react";
import { FiUpload, FiChevronDown, FiPlus, FiX } from "react-icons/fi";
import BackButton from "../../components/BackButton";
import ModalSelecionarProduto from "../../components/ModalSelecionarProduto";
import styles from "./Configuracoes.module.css";

const CATEGORIAS    = ["Eletrônicos", "E-books", "Vestuário", "Utilidades", "Serviços"];
const VOUCHERS_MOCK = [
	{ codigo: "BEMVIND0", porcentagem: "10%" },
	{ codigo: "NIVER15",  porcentagem: "15%" },
];
const N_SLOTS = 4;

function ImageUpload() {
	const [preview, setPreview] = useState(null);
	const ref = useRef(null);
	const handleFile = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const r = new FileReader();
		r.onload = (ev) => setPreview(ev.target.result);
		r.readAsDataURL(file);
	};
	return (
		<div className={styles.uploadArea}>
			<input ref={ref} type="file" accept=".jpg,.jpeg,.png" style={{display:"none"}} onChange={handleFile}/>
			<div className={styles.uploadInner}>
				<button type="button" className={styles.uploadBtn} onClick={() => ref.current.click()}>
					<FiUpload size={13}/> Adicionar Imagem
				</button>
				<span className={styles.uploadHint}>(Formatos recomendados : JPG, PNG. Tamanho máx : 10MB)</span>
			</div>
			{preview && <img src={preview} alt="preview" className={styles.uploadPreview}/>}
		</div>
	);
}

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

// ── slot individual de produto ─────────────────────────────────────────────
function ProdutoSlot({ produto, onAdd, onRemove }) {
	if (produto) {
		const economia = (produto.precoOld - produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
		return (
			<div className={styles.slot}>
				<button className={styles.slotRemover} onClick={onRemove}><FiX size={10}/></button>
				<div className={styles.slotBadge}>56% PROMO</div>
				<div className={styles.slotImgWrap}>
					{produto.imagem
						? <img src={produto.imagem} alt={produto.nome}/>
						: <span className={styles.slotLetra}>{produto.nome.charAt(0)}</span>
					}
				</div>
				<div className={styles.slotInfo}>
					<p className={styles.slotNome}>{produto.nome}</p>
					<div className={styles.slotPrecos}>
						<span className={styles.slotPreco}>R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
						{produto.precoOld && <span className={styles.slotPrecoOld}>R$ {produto.precoOld.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>}
					</div>
					<p className={styles.slotEconomia}>Economize R$ {economia}</p>
				</div>
			</div>
		);
	}
	return (
		<button className={styles.slotVazio} onClick={onAdd}>
			<FiPlus size={22}/>
			<span className={styles.slotVazioLabel}>Adicionar produto</span>
		</button>
	);
}

// ── grid de promoções ──────────────────────────────────────────────────────
function GridPromocoes({ numero }) {
	const [titulo,    setTitulo]    = useState("As melhores promoções em {categoria}");
	const [categoria, setCategoria] = useState(CATEGORIAS[numero - 1] || CATEGORIAS[0]);
	const [slots,     setSlots]     = useState(Array(N_SLOTS).fill(null));
	const [modalSlot, setModalSlot] = useState(null);

	const handleConfirm = (produto) => {
		setSlots(prev => { const n = [...prev]; n[modalSlot] = produto; return n; });
		setModalSlot(null);
	};

	return (
		<>
			<div className={styles.gridCard}>
				<p className={styles.gridLabel}>Grid {numero}</p>
				<div className={styles.gridBody}>
					<div className={styles.gridControls}>
						<div className={styles.formGroup}>
							<label>Título</label>
							<input value={titulo} onChange={e => setTitulo(e.target.value)} className={styles.input}/>
						</div>
						<div className={styles.formGroup}>
							<label>Categoria</label>
							<Select value={categoria} onChange={setCategoria} options={CATEGORIAS}/>
						</div>
					</div>
					<div className={styles.slotsRow}>
						{slots.map((produto, i) => (
							<ProdutoSlot
								key={i}
								produto={produto}
								onAdd={() => setModalSlot(i)}
								onRemove={() => setSlots(p => { const n=[...p]; n[i]=null; return n; })}
							/>
						))}
					</div>
				</div>
			</div>
			{modalSlot !== null && (
				<ModalSelecionarProduto
					categoria={categoria}
					onConfirm={handleConfirm}
					onClose={() => setModalSlot(null)}
				/>
			)}
		</>
	);
}

// ── página principal ───────────────────────────────────────────────────────
export default function Configuracoes() {
	const [corPrimaria,   setCorPrimaria]   = useState("#176FB8");
	const [corSecundaria, setCorSecundaria] = useState("#729AFF");
	const [banner1, setBanner1] = useState({ titulo:"Smartphones", descUpper:"As melhores ofertas de smartphones", desc:"Apple, Samsung, Xiaomi e mais!" });
	const [banner2, setBanner2] = useState({ titulo:"Camisas esportivas", descUpper:"Camisas de time? Também em promoção!", desc:"Torça com estilo!", desconto:"Até 50% de desconto!" });
	const [exibirBanner,  setExibirBanner]  = useState(true);
	const [tituloVoucher, setTituloVoucher] = useState("Voucher de Bem-Vindo!");
	const [textoVoucher,  setTextoVoucher]  = useState('10% OFF com o código "BEMVINDO10"');
	const [voucherSel,    setVoucherSel]    = useState("");
	const [dropVoucher,   setDropVoucher]   = useState(false);

	const s1 = (k,v) => setBanner1(p=>({...p,[k]:v}));
	const s2 = (k,v) => setBanner2(p=>({...p,[k]:v}));
	const LU=100, LD=64;

	return (
		<main className={styles.page}>
			<div className={styles.topBar}>
				<BackButton/>
				<p className={styles.breadcrumb}>🏠 &gt; Gestão &gt; Configurações</p>
			</div>

			<h1 className={styles.titulo}>Edição do Site</h1>
			<p className={styles.subtitulo}>Gerencie o visual do conteúdo do seu site</p>

			{/* 1. Identidade Visual */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>1. Identidade Visual e página inicial</h2>
				<div className={styles.identidadeCard}>
					<div className={styles.logoArea}>
						<div className={styles.logoHeader}><span>👤</span><span className={styles.logoLabel}>Logotipo da Loja</span></div>
						<div className={styles.logoPreviewWrap}><div className={styles.logoPreview}><span className={styles.logoG}>G</span></div></div>
						<ImageUpload/>
					</div>
					<div className={styles.coresArea}>
						<h3 className={styles.coresTitle}>Cores da marca</h3>
						{[["Cor Primária", corPrimaria, setCorPrimaria], ["Cor Secundária", corSecundaria, setCorSecundaria]].map(([label, val, set]) => (
							<div key={label} className={styles.corItem}>
								<span className={styles.corLabel}>{label}</span>
								<div className={styles.corInputWrap}>
									<input type="color" value={val} onChange={e=>set(e.target.value)} className={styles.corSwatch}/>
									<input type="text"  value={val} onChange={e=>set(e.target.value)} className={styles.corText}/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Banner Hero */}
				<div className={styles.bannerHeroWrap}>
					<h3 className={styles.bannerHeroTitle}>🖼 Banner Hero</h3>
					<div className={styles.bannersRow}>
						{/* Banner 1 */}
						<div className={styles.bannerCard}>
							<p className={styles.bannerNumero}>1. Banner Esquerdo</p>
							<div className={styles.formGroup}><label>Título</label><input value={banner1.titulo} onChange={e=>s1("titulo",e.target.value)} className={styles.input}/></div>
							<div className={styles.formGroup}><label>Texto de descrição (upper)</label><div className={styles.textareaWrap}><textarea value={banner1.descUpper} onChange={e=>e.target.value.length<=LU&&s1("descUpper",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{banner1.descUpper.length}/{LU}</span></div></div>
							<div className={styles.formGroup}><label>Texto de descrição</label><div className={styles.textareaWrap}><textarea value={banner1.desc} onChange={e=>e.target.value.length<=LD&&s1("desc",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{banner1.desc.length}/{LD}</span></div></div>
							<ImageUpload/>
						</div>
						{/* Banner 2 */}
						<div className={styles.bannerCard}>
							<p className={styles.bannerNumero}>2. Banner Direito</p>
							<div className={styles.formGroup}><label>Título</label><input value={banner2.titulo} onChange={e=>s2("titulo",e.target.value)} className={styles.input}/></div>
							<div className={styles.formGroup}><label>Texto de descrição (upper)</label><div className={styles.textareaWrap}><textarea value={banner2.descUpper} onChange={e=>e.target.value.length<=LU&&s2("descUpper",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{banner2.descUpper.length}/{LU}</span></div></div>
							<div className={styles.formGroup}><label>Texto de descrição</label><div className={styles.textareaWrap}><textarea value={banner2.desc} onChange={e=>e.target.value.length<=LD&&s2("desc",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{banner2.desc.length}/{LD}</span></div></div>
							<div className={styles.formGroup}><label>Texto de desconto</label><div className={styles.textareaWrap}><input value={banner2.desconto} onChange={e=>e.target.value.length<=LD&&s2("desconto",e.target.value)} className={styles.input}/><span className={styles.charCountInline}>{banner2.desconto?.length||0}/{LD}</span></div></div>
							<ImageUpload/>
						</div>
					</div>
				</div>
			</section>

			{/* 2. Grids de Promoções */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>2. Grids de Promoções e Destaques</h2>
				<div className={styles.gridsWrap}>
					<GridPromocoes numero={1}/>
					<GridPromocoes numero={2}/>
				</div>
			</section>

			{/* 3. Banner de Voucher */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>3. Banner de Voucher</h2>
				<div className={styles.voucherBannerCard}>
					<div className={styles.voucherLeft}>
						<div className={styles.toggleRow}>
							<span className={styles.toggleLabel}>Exibir banner</span>
							<button type="button" className={`${styles.toggle} ${exibirBanner?styles.toggleOn:""}`} onClick={()=>setExibirBanner(p=>!p)}>
								<span className={styles.toggleThumb}/>
							</button>
						</div>
						<div className={styles.formGroup}><label>Título</label><input value={tituloVoucher} onChange={e=>setTituloVoucher(e.target.value)} className={styles.input}/></div>
						<div className={styles.formGroup}><label>Texto descritivo</label><textarea value={textoVoucher} onChange={e=>setTextoVoucher(e.target.value)} className={styles.textarea} rows={3}/></div>
					</div>
					<div className={styles.voucherRight}>
						<label className={styles.voucherSelLabel}>Selecione o Voucher</label>
						<div style={{position:"relative"}}>
							<button type="button" className={styles.voucherSelBtn} onClick={()=>setDropVoucher(p=>!p)}>
								{voucherSel||""} <FiChevronDown size={13}/>
							</button>
							{dropVoucher && (
								<div className={styles.voucherDrop}>
									<div className={styles.voucherDropHeader}><span>Código</span><span>Porcentagem</span></div>
									{VOUCHERS_MOCK.map(v=>(
										<button key={v.codigo} type="button"
											className={`${styles.voucherDropItem} ${voucherSel===v.codigo?styles.voucherDropItemSel:""}`}
											onClick={()=>{setVoucherSel(v.codigo);setDropVoucher(false);}}
										><span>{v.codigo}</span><span>{v.porcentagem}</span></button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<div className={styles.acoes}>
				<button type="button" className={styles.btnVisualizar}>Visualizar Site</button>
				<button type="button" className={styles.btnSalvar}>Salvar Alterações</button>
			</div>
		</main>
	);
}
