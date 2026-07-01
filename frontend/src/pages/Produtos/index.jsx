import { useState, useRef, useEffect, useCallback } from "react";
import { FiSearch, FiChevronDown, FiCheck, FiEdit2, FiX } from "react-icons/fi";
import { getProdutos, createProduto, updateProduto } from "../../services/produtos";
import { apiFetch } from "../../services/api";
import styles from "./Produtos.module.css";

const STATUS_CONFIG = {
	disponivel:   { label: "Disponível",    cls: "badgeDisponivel"   },
	baixo:        { label: "Baixo estoque", cls: "badgeBaixo"        },
	indisponivel: { label: "Indisponível",  cls: "badgeIndisponivel" },
	inativo:      { label: "Inativo",       cls: "badgeInativo"      },
};

const STATUS_MANUAIS = ["disponivel", "inativo", "indisponivel"];

const fmt = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Calcula status automaticamente baseado no estoque
// Se o usuário forçou "inativo", respeita. Caso contrário, calcula.
function calcStatus(estoque, estoqueMinimo = 0, statusManual = null) {
	if (statusManual === "inativo") return "inativo";
	if (estoque === 0)              return "indisponivel";
	if (estoqueMinimo > 0 && estoque <= estoqueMinimo) return "baixo";
	return "disponivel";
}

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

function StatusBadge({ status }) {
	const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disponivel;
	return <span className={`${styles.badge} ${styles[cfg.cls]}`}>{cfg.label}</span>;
}

function ProdutoImg({ imagem, nome }) {
	if (imagem) return <img src={imagem} alt={nome} className={styles.prodImg} />;
	return (
		<div className={styles.prodImgPlaceholder}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
				<rect x="3" y="3" width="18" height="18" rx="3" fill="#ccc" />
				<path d="M3 16l5-5 4 4 3-3 6 6" stroke="#fff" strokeWidth="1.5" fill="none" />
				<circle cx="8.5" cy="8.5" r="1.5" fill="#fff" />
			</svg>
		</div>
	);
}

function Toast({ msg, tipo = "sucesso", onClose }) {
	useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
	return (
		<div className={`${styles.toast} ${tipo === "erro" ? styles.toastErro : ""}`}>
			<span className={`${styles.toastIcon} ${tipo === "erro" ? styles.toastIconErro : ""}`}>
				{tipo === "erro" ? "✕" : "✓"}
			</span>
			<span>{msg}</span>
		</div>
	);
}

function Modal({ titulo, subtitulo, onClose, children }) {
	useEffect(() => {
		const h = (e) => { if (e.key === "Escape") onClose(); };
		document.addEventListener("keydown", h);
		return () => document.removeEventListener("keydown", h);
	}, [onClose]);
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<button className={styles.modalClose} onClick={onClose}><FiX size={18} /></button>
				<h2 className={styles.modalTitulo}>{titulo}</h2>
				<p className={styles.modalSub}>{subtitulo}</p>
				{children}
			</div>
		</div>
	);
}

// ── formulário ───────────────────────────────────────────────────────────────
// modoEdicao = true → exibe campo de status manual
function ProdutoForm({ inicial, categorias, onSubmit, labelBtn, loading, modoEdicao = false }) {
	const empty = {
		nome: "", idCategoria: "", preco: "", estoqueInicial: "",
		estoqueMinimo: "", desconto: "", statusManual: "disponivel",
		imagem: "", descricao: "",
	};
	const [form, setForm]       = useState(inicial ?? empty);
	const [preview, setPreview] = useState(inicial?.imagem ?? null);
	const descMax = 250;
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	// calcula preview do status em tempo real no modo edição
	const estoqueNum  = Number(form.estoqueInicial || 0);
	const minimoNum   = Number(form.estoqueMinimo  || 0);
	const statusPreview = calcStatus(estoqueNum, minimoNum, form.statusManual);

	const handleImg = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		setPreview(url);
		setForm((f) => ({ ...f, imagem: file }));
	};

	return (
		<form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className={styles.form}>
			{/* nome */}
			<label className={styles.label}>
				* Nome
				<input className={styles.input} value={form.nome} onChange={set("nome")} required />
			</label>

			{/* categoria */}
			<label className={styles.label}>
				* Categoria
				<div className={styles.selectWrap}>
					<select className={styles.select} value={form.idCategoria} onChange={set("idCategoria")} required>
						<option value="" disabled />
						{categorias.map((c) => (
							<option key={c.id} value={c.id}>{c.nome}</option>
						))}
					</select>
					<FiChevronDown size={14} className={styles.selectIcon} />
				</div>
			</label>

			{/* preço + desconto */}
			<div className={styles.formRow}>
				<label className={styles.label}>
					* Preço de venda
					<div className={styles.inputPrefix}>
						<span>R$</span>
						<input className={styles.inputInner} type="number" min="0" step="0.01" value={form.preco} onChange={set("preco")} required />
					</div>
				</label>
				<label className={styles.label}>
					Desconto
					<div className={styles.inputSuffix}>
						<input
							className={styles.inputInner}
							type="number" min="0" max="100" step="1"
							value={form.desconto}
							onChange={set("desconto")}
							placeholder="0"
						/>
						<span>%</span>
					</div>
				</label>
			</div>

			{/* preço com desconto calculado — só mostra se tiver desconto */}
			{Number(form.desconto) > 0 && Number(form.preco) > 0 && (
				<p className={styles.descontoPreview}>
					Preço final: <strong>{fmt(Number(form.preco) * (1 - Number(form.desconto) / 100))}</strong>
					<span className={styles.descontoBadge}>{form.desconto}% OFF</span>
				</p>
			)}

			{/* estoque */}
			<div className={styles.formRow}>
				<label className={styles.label}>
					* Estoque Inicial
					<input className={styles.input} type="number" min="0" value={form.estoqueInicial} onChange={set("estoqueInicial")} required />
				</label>
				<label className={styles.label}>
					* Estoque Mínimo
					<input className={styles.input} type="number" min="0" value={form.estoqueMinimo} onChange={set("estoqueMinimo")} required />
				</label>
			</div>

			{/* status — só no modal de edição */}
			{modoEdicao && (
				<label className={styles.label}>
					Status
					<div className={styles.statusEditRow}>
						<div className={styles.selectWrap} style={{ flex: 1 }}>
							<select
								className={styles.select}
								value={form.statusManual}
								onChange={set("statusManual")}
							>
								<option value="disponivel">Disponível</option>
								<option value="inativo">Inativo</option>
								<option value="indisponivel">Indisponível</option>
							</select>
							<FiChevronDown size={14} className={styles.selectIcon} />
						</div>
						{/* preview do status real considerando estoque */}
						<div className={styles.statusPreviewWrap}>
							<span className={styles.statusPreviewLabel}>Resultado:</span>
							<StatusBadge status={statusPreview} />
						</div>
					</div>
					{form.statusManual !== "inativo" && estoqueNum > 0 && estoqueNum <= minimoNum && (
						<p className={styles.statusHint}>
							⚠️ Estoque abaixo do mínimo — será marcado como <strong>Baixo estoque</strong> automaticamente.
						</p>
					)}
				</label>
			)}

			{/* imagem */}
			<div className={styles.fotoSection}>
				<span className={styles.label}>Imagem do Produto</span>
				<div className={styles.fotoRow}>
					{preview
						? <img src={preview} alt="preview" className={styles.fotoPreview} />
						: <div className={styles.fotoPlaceholder}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<rect x="3" y="3" width="18" height="18" rx="3" fill="#ccc" />
									<path d="M3 16l5-5 4 4 3-3 6 6" stroke="#fff" strokeWidth="1.5" fill="none" />
									<circle cx="8.5" cy="8.5" r="1.5" fill="#fff" />
								</svg>
							</div>
					}
					<label className={styles.fotoBtn}>
						Adicionar Imagem
						<input type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImg} />
					</label>
					<span className={styles.fotoHint}>Formatos recomendados : JPG, PNG.<br />Tamanho máx : 10MB</span>
				</div>
			</div>

			{/* descrição */}
			<label className={styles.label}>
				Descrição
				<div className={styles.textareaWrap}>
					<textarea className={styles.textarea} maxLength={descMax} value={form.descricao} onChange={set("descricao")} rows={4} />
					<span className={styles.charCount}>{(form.descricao || "").length}/{descMax}</span>
				</div>
			</label>

			<button type="submit" className={styles.submitBtn} disabled={loading}>
				{loading ? "Salvando..." : labelBtn}
			</button>
		</form>
	);
}

// ── página ────────────────────────────────────────────────────────────────────
export default function Produtos() {
	const [produtos,        setProdutos]        = useState([]);
	const [categorias,      setCategorias]      = useState([]);
	const [carregando,      setCarregando]      = useState(true);
	const [busca,           setBusca]           = useState("");
	const [filtroAtivo,     setFiltroAtivo]     = useState("todos");
	const [filtroCategoria, setFiltroCategoria] = useState([]);
	const [filtroStatus,    setFiltroStatus]    = useState([]);
	const [filtroTemp,      setFiltroTemp]      = useState({ categoria: [], status: [] });
	const [modalNovo,       setModalNovo]       = useState(false);
	const [modalEditar,     setModalEditar]     = useState(null);
	const [toast,           setToast]           = useState(null);
	const [loadingForm,     setLoadingForm]     = useState(false);

	const filtroDrop = useDropdown();
	const ativoDrop  = useDropdown();

	const carregar = useCallback(async () => {
		setCarregando(true);
		try {
			const [prods, cats] = await Promise.all([
				getProdutos(),
				apiFetch("/categorias"),
			]);
			setProdutos(prods);
			setCategorias(cats.map((c) => ({ id: c.id_categoria, nome: c.nome_categoria })));
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setCarregando(false);
		}
	}, []);

	useEffect(() => { carregar(); }, [carregar]);

	const nomesCategorias = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))];

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

	let dados = produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
	if (filtroAtivo === "ativos")   dados = dados.filter((p) => p.status !== "inativo");
	if (filtroAtivo === "inativos") dados = dados.filter((p) => p.status === "inativo");
	if (filtroCategoria.length)     dados = dados.filter((p) => filtroCategoria.includes(p.categoria));
	if (filtroStatus.length)        dados = dados.filter((p) => filtroStatus.includes(p.status));

	// ── criar ────────────────────────────────────────────
	const handleNovo = async (form) => {
		setLoadingForm(true);
		try {
			const formData = new FormData();
			formData.append("name",         form.nome);
			formData.append("price",        form.preco);
			formData.append("description",  form.descricao);
			formData.append("idCategoria",  form.idCategoria);
			formData.append("initialStock", form.estoqueInicial);
			formData.append("minStock",     form.estoqueMinimo);
			// desconto: salvo como porcentagem (0-100)
			if (form.desconto) formData.append("discount", form.desconto);
			if (form.imagem instanceof File) formData.append("produtoImage", form.imagem);

			const novo = await createProduto(formData);
			const status = calcStatus(
				Number(form.estoqueInicial),
				Number(form.estoqueMinimo),
				null
			);
			setProdutos((prev) => [...prev, {
				...novo,
				status,
				desconto: Number(form.desconto || 0),
				precoOld: Number(form.desconto) > 0 ? Number(form.preco) : null,
				preco: Number(form.desconto) > 0
					? Number(form.preco) * (1 - Number(form.desconto) / 100)
					: Number(form.preco),
			}]);
			setModalNovo(false);
			setToast({ msg: "Produto adicionado com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	// ── editar ────────────────────────────────────────────
	const handleEditar = async (form) => {
		setLoadingForm(true);
		try {
			const formData = new FormData();
			formData.append("name",         form.nome);
			formData.append("price",        form.preco);
			formData.append("description",  form.descricao);
			formData.append("idCategoria",  form.idCategoria);
			formData.append("initialStock", form.estoqueInicial);
			formData.append("minStock",     form.estoqueMinimo);
			formData.append("status",       form.statusManual);
			if (form.desconto) formData.append("discount", form.desconto);
			if (form.imagem instanceof File) formData.append("produtoImage", form.imagem);

			const atualizado = await updateProduto(modalEditar.id, formData);
			const status = calcStatus(
				Number(form.estoqueInicial),
				Number(form.estoqueMinimo),
				form.statusManual
			);
			setProdutos((prev) =>
				prev.map((p) =>
					p.id === modalEditar.id
						? {
								...atualizado,
								status,
								desconto: Number(form.desconto || 0),
								precoOld: Number(form.desconto) > 0 ? Number(form.preco) : null,
								preco: Number(form.desconto) > 0
									? Number(form.preco) * (1 - Number(form.desconto) / 100)
									: Number(form.preco),
							}
						: p
				)
			);
			setModalEditar(null);
			setToast({ msg: "Produto editado com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Estoque &gt; Produtos</p>
			<h1 className={styles.titulo}>Produtos</h1>
			<p className={styles.subtitulo}>Catálogo de itens e gerenciamento de estoque simples</p>

			<div className={styles.controles}>
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon} />
					<input className={styles.busca} placeholder="Pesquisar Produtos" value={busca} onChange={(e) => setBusca(e.target.value)} />
				</div>

				<div className={styles.dropWrap} ref={ativoDrop.ref}>
					<button className={styles.selectBtn} onClick={() => ativoDrop.setOpen((o) => !o)}>
						{filtroAtivo === "todos" ? "Ativos/Inativos" : filtroAtivo === "ativos" ? "Ativos" : "Inativos"}
						<FiChevronDown size={13} />
					</button>
					{ativoDrop.open && (
						<div className={styles.dropMenu}>
							{["todos", "ativos", "inativos"].map((op) => (
								<button key={op}
									className={`${styles.dropItem} ${filtroAtivo === op ? styles.dropItemActive : ""}`}
									onClick={() => { setFiltroAtivo(op); ativoDrop.setOpen(false); }}
								>
									{op === "todos" ? "Ativos/Inativos" : op.charAt(0).toUpperCase() + op.slice(1)}
									{filtroAtivo === op && <FiCheck size={12} />}
								</button>
							))}
						</div>
					)}
				</div>

				<div className={styles.dropWrap} ref={filtroDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => filtroDrop.setOpen((o) => !o)}>
						<span className={styles.filtroIcon}>⊞</span> Filtro
					</button>
					{filtroDrop.open && (
						<div className={styles.filtroDropdown}>
							<p className={styles.filtroGrupoTitulo}>Categoria</p>
							{nomesCategorias.map((c) => (
								<label key={c} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.categoria.includes(c)} onChange={() => toggleTemp("categoria", c)} />
									{c}
								</label>
							))}
							<p className={styles.filtroGrupoTitulo} style={{ marginTop: 10 }}>Status</p>
							{Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
								<label key={val} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.status.includes(val)} onChange={() => toggleTemp("status", val)} />
									{label}
								</label>
							))}
							<button className={styles.aplicarBtn} onClick={aplicar}><FiCheck size={12} /> Aplicar Filtro</button>
						</div>
					)}
				</div>

				<button className={styles.novoBtn} onClick={() => setModalNovo(true)}>+ Novo Produto</button>
			</div>

			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Produto</th>
							<th>Categoria</th>
							<th>Estoque</th>
							<th>Preço</th>
							<th>Desconto</th>
							<th>Status</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{carregando ? (
							<tr><td colSpan={7} className={styles.vazio}>Carregando...</td></tr>
						) : dados.length === 0 ? (
							<tr><td colSpan={7} className={styles.vazio}>Nenhum produto encontrado.</td></tr>
						) : dados.map((p) => (
							<tr key={p.id}>
								<td>
									<div className={styles.prodCell}>
										<ProdutoImg imagem={p.imagem} nome={p.nome} />
										<span>{p.nome}</span>
									</div>
								</td>
								<td>{p.categoria}</td>
								<td>{p.estoqueAtual ?? p.estoqueInicial ?? 0}</td>
								<td>
									<div>{fmt(p.preco)}</div>
									{p.precoOld && <div className={styles.precoOldTabela}>{fmt(p.precoOld)}</div>}
								</td>
								<td>
									{p.desconto > 0
										? <span className={styles.descontoBadgeTabela}>{p.desconto}% OFF</span>
										: <span className={styles.semDesconto}>—</span>
									}
								</td>
								<td><StatusBadge status={p.status} /></td>
								<td>
									<button className={styles.editBtn} onClick={() => setModalEditar(p)} title="Editar produto">
										<FiEdit2 size={15} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{modalNovo && (
				<Modal titulo="Novo produto" subtitulo="*Preencha os dados do novo produto" onClose={() => setModalNovo(false)}>
					<ProdutoForm
						categorias={categorias}
						labelBtn="Adicionar Produto"
						onSubmit={handleNovo}
						loading={loadingForm}
					/>
				</Modal>
			)}

			{modalEditar && (
				<Modal titulo="Editar produto" subtitulo="*Edite os dados do produto" onClose={() => setModalEditar(null)}>
					<ProdutoForm
						modoEdicao
						categorias={categorias}
						inicial={{
							nome:          modalEditar.nome,
							idCategoria:   modalEditar.idCategoria,
							preco:         modalEditar.precoOld ?? modalEditar.preco,
							estoqueInicial: modalEditar.estoqueInicial ?? modalEditar.estoqueAtual ?? 0,
							estoqueMinimo:  modalEditar.estoqueMinimo ?? 0,
							desconto:       modalEditar.desconto ?? 0,
							statusManual:   modalEditar.status === "baixo" ? "disponivel" : (modalEditar.status ?? "disponivel"),
							imagem:         modalEditar.imagem,
							descricao:      modalEditar.descricao,
						}}
						labelBtn="Editar Produto"
						onSubmit={handleEditar}
						loading={loadingForm}
					/>
				</Modal>
			)}

			{toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
		</main>
	);
}
