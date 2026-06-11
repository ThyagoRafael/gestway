import { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown, FiCheck, FiEdit2, FiX } from "react-icons/fi";
import styles from "./Produtos.module.css";

// ── dados mock ──────────────────────────────────────────────────────────────
const CATEGORIAS = ["Vestuário", "Itens", "Software", "Serviços"];

const PRODUTOS_MOCK = [
	{
		id: 1,
		nome: "Camisa Corinthians",
		categoria: "Vestuário",
		estoque: 2,
		estoqueMinimo: 10,
		preco: 189.99,
		status: "baixo",
		imagem: null,
		descricao: "",
	},
	{
		id: 2,
		nome: "Taça Mundial Palmeiras",
		categoria: "Itens",
		estoque: 0,
		estoqueMinimo: 1,
		preco: 1234500,
		status: "indisponivel",
		imagem: null,
		descricao: "",
	},
	{
		id: 3,
		nome: "Plano GestWay",
		categoria: "Software",
		estoque: Infinity,
		estoqueMinimo: 0,
		preco: 2000,
		status: "disponivel",
		imagem: null,
		descricao: "",
	},
	{
		id: 4,
		nome: "Plano Anti-Calvície",
		categoria: "Serviços",
		estoque: 0,
		estoqueMinimo: 0,
		preco: 35000,
		status: "inativo",
		imagem: null,
		descricao: "",
	},
	{
		id: 5,
		nome: "Plano Anti-Calvície",
		categoria: "Serviços",
		estoque: 0,
		estoqueMinimo: 0,
		preco: 35000,
		status: "disponivel",
		imagem: null,
		descricao: "",
	},
];

const STATUS_CONFIG = {
	disponivel:  { label: "Disponível",   cls: "badgeDisponivel"  },
	baixo:       { label: "Baixo estoque", cls: "badgeBaixo"      },
	indisponivel:{ label: "Indisponível",  cls: "badgeIndisponivel"},
	inativo:     { label: "Inativo",       cls: "badgeInativo"    },
};

const fmt = (v) =>
	v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function calcStatus(estoque, estoqueMinimo) {
	if (estoque === Infinity) return "disponivel";
	if (estoque === 0)        return "indisponivel";
	if (estoque < estoqueMinimo) return "baixo";
	return "disponivel";
}

// ── hook dropdown ───────────────────────────────────────────────────────────
function useDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
		document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, []);
	return { open, setOpen, ref };
}

// ── badge status ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
	const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disponivel;
	return <span className={`${styles.badge} ${styles[cfg.cls]}`}>{cfg.label}</span>;
}

// ── avatar produto ──────────────────────────────────────────────────────────
function ProdutoImg({ imagem, nome }) {
	if (imagem) return <img src={imagem} alt={nome} className={styles.prodImg} />;
	return (
		<div className={styles.prodImgPlaceholder}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
				<rect x="3" y="3" width="18" height="18" rx="3" fill="#ccc"/>
				<path d="M3 16l5-5 4 4 3-3 6 6" stroke="#fff" strokeWidth="1.5" fill="none"/>
				<circle cx="8.5" cy="8.5" r="1.5" fill="#fff"/>
			</svg>
		</div>
	);
}

// ── toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
	useEffect(() => {
		const t = setTimeout(onClose, 3000);
		return () => clearTimeout(t);
	}, [onClose]);
	return (
		<div className={styles.toast}>
			<span className={styles.toastIcon}>✓</span>
			<span>{msg}</span>
		</div>
	);
}

// ── modal wrapper ───────────────────────────────────────────────────────────
function Modal({ titulo, subtitulo, onClose, children }) {
	useEffect(() => {
		const h = (e) => { if (e.key === "Escape") onClose(); };
		document.addEventListener("keydown", h);
		return () => document.removeEventListener("keydown", h);
	}, [onClose]);
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<button className={styles.modalClose} onClick={onClose}><FiX size={18}/></button>
				<h2 className={styles.modalTitulo}>{titulo}</h2>
				<p className={styles.modalSub}>{subtitulo}</p>
				{children}
			</div>
		</div>
	);
}

// ── formulário ──────────────────────────────────────────────────────────────
function ProdutoForm({ inicial, onSubmit, labelBtn }) {
	const empty = { nome: "", categoria: "", preco: "", estoqueInicial: "", estoqueMinimo: "", imagem: null, descricao: "" };
	const [form, setForm] = useState(inicial ?? empty);
	const [preview, setPreview] = useState(inicial?.imagem ?? null);
	const descMax = 250;

	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const handleImg = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		setPreview(url);
		setForm((f) => ({ ...f, imagem: url }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<label className={styles.label}>
				* Nome
				<input className={styles.input} value={form.nome} onChange={set("nome")} required />
			</label>

			<label className={styles.label}>
				* Categoria
				<div className={styles.selectWrap}>
					<select className={styles.select} value={form.categoria} onChange={set("categoria")} required>
						<option value="" disabled />
						{CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
					</select>
					<FiChevronDown size={14} className={styles.selectIcon}/>
				</div>
			</label>

			<div className={styles.formRow}>
				<label className={styles.label}>
					* Preço de venda
					<div className={styles.inputPrefix}>
						<span>R$</span>
						<input
							className={styles.inputInner}
							type="number" min="0" step="0.01"
							value={form.preco}
							onChange={set("preco")}
							required
						/>
					</div>
				</label>

				<label className={styles.label}>
					* Estoque Inicial
					<input className={styles.input} type="number" min="0" value={form.estoqueInicial} onChange={set("estoqueInicial")} required />
				</label>
			</div>

			<div className={styles.formRowRight}>
				<label className={styles.label}>
					* Estoque Mínimo
					<input className={styles.input} type="number" min="0" value={form.estoqueMinimo} onChange={set("estoqueMinimo")} required />
				</label>
			</div>

			<div className={styles.fotoSection}>
				<span className={styles.label}>Imagem do Produto</span>
				<div className={styles.fotoRow}>
					{preview
						? <img src={preview} alt="preview" className={styles.fotoPreview}/>
						: <div className={styles.fotoPlaceholder}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<rect x="3" y="3" width="18" height="18" rx="3" fill="#ccc"/>
									<path d="M3 16l5-5 4 4 3-3 6 6" stroke="#fff" strokeWidth="1.5" fill="none"/>
									<circle cx="8.5" cy="8.5" r="1.5" fill="#fff"/>
								</svg>
							</div>
					}
					<label className={styles.fotoBtn}>
						Adicionar Imagem
						<input type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImg}/>
					</label>
					<span className={styles.fotoHint}>Formatos recomendados : JPG, PNG.<br/>Tamanho máx : 10MB</span>
				</div>
			</div>

			<label className={styles.label}>
				Descrição
				<div className={styles.textareaWrap}>
					<textarea
						className={styles.textarea}
						maxLength={descMax}
						value={form.descricao}
						onChange={set("descricao")}
						rows={4}
					/>
					<span className={styles.charCount}>{(form.descricao || "").length}/{descMax}</span>
				</div>
			</label>

			<button type="submit" className={styles.submitBtn}>{labelBtn}</button>
		</form>
	);
}

// ── página ──────────────────────────────────────────────────────────────────
export default function Produtos() {
	const [produtos, setProdutos] = useState(PRODUTOS_MOCK);
	const [busca, setBusca] = useState("");
	const [filtroAtivo, setFiltroAtivo] = useState("todos");
	const [filtroCategoria, setFiltroCategoria] = useState([]);
	const [filtroStatus, setFiltroStatus] = useState([]);
	const [filtroTemp, setFiltroTemp] = useState({ categoria: [], status: [] });

	const [modalNovo, setModalNovo] = useState(false);
	const [modalEditar, setModalEditar] = useState(null);
	const [toast, setToast] = useState(null);

	const filtroDrop = useDropdown();
	const ativoDrop  = useDropdown();

	const aplicar = () => {
		setFiltroCategoria(filtroTemp.categoria);
		setFiltroStatus(filtroTemp.status);
		filtroDrop.setOpen(false);
	};

	const toggleTemp = (grupo, val) =>
		setFiltroTemp((f) => ({
			...f,
			[grupo]: f[grupo].includes(val) ? f[grupo].filter((x) => x !== val) : [...f[grupo], val],
		}));

	let dados = produtos.filter((p) =>
		p.nome.toLowerCase().includes(busca.toLowerCase())
	);
	if (filtroAtivo === "ativos")   dados = dados.filter((p) => p.status !== "inativo");
	if (filtroAtivo === "inativos") dados = dados.filter((p) => p.status === "inativo");
	if (filtroCategoria.length)     dados = dados.filter((p) => filtroCategoria.includes(p.categoria));
	if (filtroStatus.length)        dados = dados.filter((p) => filtroStatus.includes(p.status));

	const handleNovo = (form) => {
		const estoque = form.estoqueInicial === "" ? 0 : Number(form.estoqueInicial);
		const min     = form.estoqueMinimo  === "" ? 0 : Number(form.estoqueMinimo);
		setProdutos((prev) => [...prev, {
			id: Date.now(),
			nome: form.nome,
			categoria: form.categoria,
			estoque,
			estoqueMinimo: min,
			preco: Number(form.preco),
			status: calcStatus(estoque, min),
			imagem: form.imagem,
			descricao: form.descricao,
		}]);
		setModalNovo(false);
		setToast("Produto adicionado com sucesso!");
	};

	const handleEditar = (form) => {
		const estoque = form.estoqueInicial === "" ? modalEditar.estoque : Number(form.estoqueInicial);
		const min     = form.estoqueMinimo  === "" ? 0 : Number(form.estoqueMinimo);
		setProdutos((prev) => prev.map((p) =>
			p.id === modalEditar.id
				? { ...p, nome: form.nome, categoria: form.categoria, estoque, estoqueMinimo: min,
					preco: Number(form.preco), status: calcStatus(estoque, min),
					imagem: form.imagem, descricao: form.descricao }
				: p
		));
		setModalEditar(null);
		setToast("Produto editado com sucesso!");
	};

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Estoque &gt; Produtos</p>
			<h1 className={styles.titulo}>Produtos</h1>
			<p className={styles.subtitulo}>Catálogo de itens e gerenciamento de estoque simples</p>

			{/* controles */}
			<div className={styles.controles}>
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon}/>
					<input
						className={styles.busca}
						placeholder="Pesquisar Produtos"
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
				</div>

				{/* ativo/inativo */}
				<div className={styles.dropWrap} ref={ativoDrop.ref}>
					<button className={styles.selectBtn} onClick={() => ativoDrop.setOpen((o) => !o)}>
						{filtroAtivo === "todos" ? "Ativos/Inativos" : filtroAtivo === "ativos" ? "Ativos" : "Inativos"}
						<FiChevronDown size={13}/>
					</button>
					{ativoDrop.open && (
						<div className={styles.dropMenu}>
							{["todos","ativos","inativos"].map((op) => (
								<button key={op}
									className={`${styles.dropItem} ${filtroAtivo === op ? styles.dropItemActive : ""}`}
									onClick={() => { setFiltroAtivo(op); ativoDrop.setOpen(false); }}
								>
									{op === "todos" ? "Ativos/Inativos" : op.charAt(0).toUpperCase() + op.slice(1)}
									{filtroAtivo === op && <FiCheck size={12}/>}
								</button>
							))}
						</div>
					)}
				</div>

				{/* filtro avançado */}
				<div className={styles.dropWrap} ref={filtroDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => filtroDrop.setOpen((o) => !o)}>
						<span className={styles.filtroIcon}>⊞</span> Filtro
					</button>
					{filtroDrop.open && (
						<div className={styles.filtroDropdown}>
							<p className={styles.filtroGrupoTitulo}>Categoria</p>
							{CATEGORIAS.map((c) => (
								<label key={c} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.categoria.includes(c)} onChange={() => toggleTemp("categoria", c)}/>
									{c}
								</label>
							))}
							<p className={styles.filtroGrupoTitulo} style={{ marginTop: 10 }}>Status</p>
							{Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
								<label key={val} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.status.includes(val)} onChange={() => toggleTemp("status", val)}/>
									{label}
								</label>
							))}
							<button className={styles.aplicarBtn} onClick={aplicar}>
								<FiCheck size={12}/> Aplicar Filtro
							</button>
						</div>
					)}
				</div>

				<button className={styles.novoBtn} onClick={() => setModalNovo(true)}>
					+ Novo Produto
				</button>
			</div>

			{/* tabela */}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Produto</th>
							<th>Categoria</th>
							<th>Estoque</th>
							<th>Preço</th>
							<th>Status</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{dados.length === 0 ? (
							<tr><td colSpan={6} className={styles.vazio}>Nenhum produto encontrado.</td></tr>
						) : dados.map((p) => (
							<tr key={p.id}>
								<td>
									<div className={styles.prodCell}>
										<ProdutoImg imagem={p.imagem} nome={p.nome}/>
										<span>{p.nome}</span>
									</div>
								</td>
								<td>{p.categoria}</td>
								<td>{p.estoque === Infinity ? "∞" : p.estoque}</td>
								<td>{fmt(p.preco)}</td>
								<td><StatusBadge status={p.status}/></td>
								<td>
									<button className={styles.editBtn} onClick={() => setModalEditar(p)} title="Editar produto">
										<FiEdit2 size={15}/>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* modal novo */}
			{modalNovo && (
				<Modal titulo="Novo produto" subtitulo="*Preencha os dados do novo produto" onClose={() => setModalNovo(false)}>
					<ProdutoForm labelBtn="Adicionar Produto" onSubmit={handleNovo}/>
				</Modal>
			)}

			{/* modal editar */}
			{modalEditar && (
				<Modal titulo="Editar produto" subtitulo="*Edite os dados do produto" onClose={() => setModalEditar(null)}>
					<ProdutoForm
						inicial={{
							nome: modalEditar.nome,
							categoria: modalEditar.categoria,
							preco: modalEditar.preco,
							estoqueInicial: modalEditar.estoque === Infinity ? "" : modalEditar.estoque,
							estoqueMinimo: modalEditar.estoqueMinimo,
							imagem: modalEditar.imagem,
							descricao: modalEditar.descricao,
						}}
						labelBtn="Editar Produto"
						onSubmit={handleEditar}
					/>
				</Modal>
			)}

			{toast && <Toast msg={toast} onClose={() => setToast(null)}/>}
		</main>
	);
}
