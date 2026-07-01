import { useState, useRef, useEffect } from "react";
import { FiUpload, FiChevronDown, FiPlus, FiX } from "react-icons/fi";
import BackButton from "../../components/BackButton";
import ModalSelecionarProduto from "../../components/ModalSelecionarProduto";
import { useConfig } from "../../contexts/ConfigContext";
import { getVouchers } from "../../services/vouchers";
import styles from "./Configuracoes.module.css";

const CATEGORIAS = ["Eletrônicos", "E-books", "Vestuário", "Utilidades", "Serviços"];
const N_SLOTS    = 4;

// ── upload de imagem ───────────────────────────────────────────────────────
function ImageUpload({ value, onChange }) {
	const ref = useRef(null);
	const handleFile = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const r = new FileReader();
		r.onload = (ev) => onChange(ev.target.result);
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
			{value && <img src={value} alt="preview" className={styles.uploadPreview}/>}
		</div>
	);
}

// ── select ─────────────────────────────────────────────────────────────────
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

// ── slot de produto ────────────────────────────────────────────────────────
function ProdutoSlot({ produto, onAdd, onRemove }) {
	if (produto) {
		const economia = produto.precoOld
			? (produto.precoOld - produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
			: "0,00";
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
function GridPromocoes({ numero, gridKey }) {
	const { config, atualizar, salvar } = useConfig();
	const grid = config[gridKey];

	const setTitulo    = (v) => atualizar({ [gridKey]: { ...grid, titulo: v } });
	const setCategoria = (v) => atualizar({ [gridKey]: { ...grid, categoria: v } });
	const setSlot      = (i, produto) => {
		const slots = [...grid.slots];
		slots[i] = produto;
		atualizar({ [gridKey]: { ...grid, slots } });
	};

	const [modalSlot, setModalSlot] = useState(null);

	return (
		<>
			<div className={styles.gridCard}>
				<p className={styles.gridLabel}>Grid {numero}</p>
				<div className={styles.gridBody}>
					<div className={styles.gridControls}>
						<div className={styles.formGroup}>
							<label>Título</label>
							<input value={grid.titulo} onChange={e => setTitulo(e.target.value)} className={styles.input}/>
						</div>
						<div className={styles.formGroup}>
							<label>Categoria</label>
							<Select value={grid.categoria} onChange={setCategoria} options={CATEGORIAS}/>
						</div>
					</div>
					<div className={styles.slotsRow}>
						{grid.slots.map((produto, i) => (
							<ProdutoSlot
								key={i}
								produto={produto}
								onAdd={() => setModalSlot(i)}
								onRemove={() => setSlot(i, null)}
							/>
						))}
					</div>
				</div>
			</div>
			{modalSlot !== null && (
				<ModalSelecionarProduto
					categoria={grid.categoria}
					onConfirm={(p) => { setSlot(modalSlot, p); setModalSlot(null); }}
					onClose={() => setModalSlot(null)}
				/>
			)}
		</>
	);
}

// ── página principal ───────────────────────────────────────────────────────
export default function Configuracoes() {
	const { config, atualizar, salvar } = useConfig();

	const [vouchers,    setVouchers]    = useState([]);
	const [dropVoucher, setDropVoucher] = useState(false);
	const [salvo,       setSalvo]       = useState(false);

	// carrega vouchers reais da API
	useEffect(() => {
		getVouchers()
			.then(vs => setVouchers(vs.filter(v => v.status === "Ativo")))
			.catch(() => {}); // falha silenciosa sem banco
	}, []);

	const s1 = (k, v) => atualizar({ banner1: { ...config.banner1, [k]: v } });
	const s2 = (k, v) => atualizar({ banner2: { ...config.banner2, [k]: v } });
	const LU = 100, LD = 64;

	const handleSalvar = () => {
		const ok = salvar();
		if (ok) {
			setSalvo(true);
			setTimeout(() => setSalvo(false), 3000);
		}
	};

	return (
		<main className={styles.page}>
			<div className={styles.topBar}>
				<BackButton/>
				<p className={styles.breadcrumb}>🏠 &gt; Gestão &gt; Configurações</p>
			</div>

			<h1 className={styles.titulo}>Edição do Site</h1>
			<p className={styles.subtitulo}>Gerencie o visual do conteúdo do seu site</p>

			{salvo && <p className={styles.salvoMsg}>✓ Alterações salvas com sucesso!</p>}

			{/* 1. Identidade Visual */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>1. Identidade Visual e página inicial</h2>
				<div className={styles.identidadeCard}>
					<div className={styles.logoArea}>
						<div className={styles.logoHeader}><span>👤</span><span className={styles.logoLabel}>Logotipo da Loja</span></div>
						<div className={styles.logoPreviewWrap}>
							<div className={styles.logoPreview}>
								{config.logo
									? <img src={config.logo} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:14}}/>
									: <span className={styles.logoG}>G</span>
								}
							</div>
						</div>
						<ImageUpload value={config.logo} onChange={v => atualizar({ logo: v })}/>
					</div>
					<div className={styles.coresArea}>
						<h3 className={styles.coresTitle}>Cores da marca</h3>
						{[["Cor Primária", "corPrimaria"], ["Cor Secundária", "corSecundaria"]].map(([label, key]) => (
							<div key={key} className={styles.corItem}>
								<span className={styles.corLabel}>{label}</span>
								<div className={styles.corInputWrap}>
									<input type="color" value={config[key]} onChange={e => atualizar({ [key]: e.target.value })} className={styles.corSwatch}/>
									<input type="text"  value={config[key]} onChange={e => atualizar({ [key]: e.target.value })} className={styles.corText}/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* banners hero */}
				<div className={styles.bannerHeroWrap}>
					<h3 className={styles.bannerHeroTitle}>🖼 Banner Hero</h3>
					<div className={styles.bannersRow}>
						<div className={styles.bannerCard}>
							<p className={styles.bannerNumero}>1. Banner Esquerdo</p>
							<div className={styles.formGroup}><label>Título</label><input value={config.banner1.titulo} onChange={e=>s1("titulo",e.target.value)} className={styles.input}/></div>
							<div className={styles.formGroup}><label>Texto de descrição (upper)</label><div className={styles.textareaWrap}><textarea value={config.banner1.descUpper} onChange={e=>e.target.value.length<=LU&&s1("descUpper",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{config.banner1.descUpper.length}/{LU}</span></div></div>
							<div className={styles.formGroup}><label>Texto de descrição</label><div className={styles.textareaWrap}><textarea value={config.banner1.desc} onChange={e=>e.target.value.length<=LD&&s1("desc",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{config.banner1.desc.length}/{LD}</span></div></div>
							<div className={styles.formGroup}><label>Texto de desconto</label><input value={config.banner1.desconto||""} onChange={e=>s1("desconto",e.target.value)} className={styles.input}/></div>
							<ImageUpload value={config.banner1.imagem} onChange={v=>s1("imagem",v)}/>
						</div>
						<div className={styles.bannerCard}>
							<p className={styles.bannerNumero}>2. Banner Direito</p>
							<div className={styles.formGroup}><label>Título</label><input value={config.banner2.titulo} onChange={e=>s2("titulo",e.target.value)} className={styles.input}/></div>
							<div className={styles.formGroup}><label>Texto de descrição (upper)</label><div className={styles.textareaWrap}><textarea value={config.banner2.descUpper} onChange={e=>e.target.value.length<=LU&&s2("descUpper",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{config.banner2.descUpper.length}/{LU}</span></div></div>
							<div className={styles.formGroup}><label>Texto de descrição</label><div className={styles.textareaWrap}><textarea value={config.banner2.desc} onChange={e=>e.target.value.length<=LD&&s2("desc",e.target.value)} className={styles.textarea} rows={3}/><span className={styles.charCount}>{config.banner2.desc.length}/{LD}</span></div></div>
							<div className={styles.formGroup}><label>Texto de desconto</label><div className={styles.textareaWrap}><input value={config.banner2.desconto||""} onChange={e=>s2("desconto",e.target.value)} className={styles.input}/><span className={styles.charCountInline}>{config.banner2.desconto?.length||0}/{LD}</span></div></div>
							<ImageUpload value={config.banner2.imagem} onChange={v=>s2("imagem",v)}/>
						</div>
					</div>
				</div>
			</section>

			{/* 2. Grids */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>2. Grids de Promoções e Destaques</h2>
				<div className={styles.gridsWrap}>
					<GridPromocoes numero={1} gridKey="grid1"/>
					<GridPromocoes numero={2} gridKey="grid2"/>
					<GridPromocoes numero={3} gridKey="grid3"/>
				</div>
			</section>

			{/* 3. Banner de Voucher */}
			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>3. Banner de Voucher</h2>
				<div className={styles.voucherBannerCard}>
					<div className={styles.voucherLeft}>
						<div className={styles.toggleRow}>
							<span className={styles.toggleLabel}>Exibir banner</span>
							<button type="button" className={`${styles.toggle} ${config.exibirBanner?styles.toggleOn:""}`} onClick={()=>atualizar({exibirBanner:!config.exibirBanner})}>
								<span className={styles.toggleThumb}/>
							</button>
						</div>
						<div className={styles.formGroup}><label>Título</label><input value={config.tituloVoucher} onChange={e=>atualizar({tituloVoucher:e.target.value})} className={styles.input}/></div>
						<div className={styles.formGroup}><label>Texto descritivo</label><textarea value={config.textoVoucher} onChange={e=>atualizar({textoVoucher:e.target.value})} className={styles.textarea} rows={3}/></div>
					</div>
					<div className={styles.voucherRight}>
						<label className={styles.voucherSelLabel}>Selecione o Voucher</label>
						<div style={{position:"relative"}}>
							<button type="button" className={styles.voucherSelBtn} onClick={()=>setDropVoucher(p=>!p)}>
								{config.voucherSel?.codigo || "Selecionar..."} <FiChevronDown size={13}/>
							</button>
							{dropVoucher && (
								<div className={styles.voucherDrop}>
									<div className={styles.voucherDropHeader}><span>Código</span><span>Porcentagem</span></div>
									{vouchers.length === 0
										? <p style={{padding:"8px 14px",fontSize:"0.8rem",color:"#888"}}>Nenhum voucher ativo</p>
										: vouchers.map(v => (
											<button key={v.id} type="button"
												className={`${styles.voucherDropItem} ${config.voucherSel?.id===v.id?styles.voucherDropItemSel:""}`}
												onClick={()=>{atualizar({voucherSel:v});setDropVoucher(false);}}
											><span>{v.codigo}</span><span>{v.desconto}</span></button>
										))
									}
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<div className={styles.acoes}>
				<button type="button" className={styles.btnVisualizar} onClick={() => window.open("/", "_blank")}>Visualizar Site</button>
				<button type="button" className={styles.btnSalvar} onClick={handleSalvar}>Salvar Alterações</button>
			</div>
		</main>
	);
}
