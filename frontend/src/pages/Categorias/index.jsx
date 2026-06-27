import { useState, useRef, useEffect, useCallback } from "react";
import { FiSearch, FiChevronDown, FiCheck, FiEdit2, FiX } from "react-icons/fi";
import { getCategorias, createCategoria, updateCategoria } from "../../services/categorias";
import styles from "./Categorias.module.css";

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

const CatIcon = () => (
	<div className={styles.catIcon}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<rect x="3" y="3" width="8" height="8" rx="1.5" fill="#aaa" />
			<rect x="13" y="3" width="8" height="8" rx="1.5" fill="#aaa" />
			<rect x="3" y="13" width="8" height="8" rx="1.5" fill="#aaa" />
			<rect x="13" y="13" width="8" height="8" rx="1.5" fill="#aaa" />
		</svg>
	</div>
);

function StatusBadge({ status }) {
	return (
		<span className={`${styles.badge} ${status === "disponivel" ? styles.badgeDisponivel : styles.badgeInativo}`}>
			{status === "disponivel" ? "Disponível" : "Inativo"}
		</span>
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

function CategoriaForm({ inicial, onSubmit, labelBtn, loading }) {
	const empty = { nome: "", imagem: null, descricao: "" };
	const [form, setForm]       = useState(inicial ?? empty);
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

	return (
		<form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className={styles.form}>
			<label className={styles.label}>
				* Nome
				<input className={styles.input} value={form.nome} onChange={set("nome")} required />
			</label>

			<div className={styles.fotoSection}>
				<span className={styles.label}>Imagem da categoria</span>
				<div className={styles.fotoRow}>
					{preview
						? <img src={preview} alt="preview" className={styles.fotoPreview} />
						: <div className={styles.fotoPlaceholder}>
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
									<rect x="2" y="2" width="20" height="20" rx="3" stroke="#ccc" strokeWidth="1.5" fill="none" />
									<path d="M2 16l5-5 4 4 3-3 8 8" stroke="#ccc" strokeWidth="1.5" fill="none" />
									<circle cx="8" cy="8" r="2" fill="#ccc" />
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

export default function Categorias() {
	const [categorias,   setCategorias]   = useState([]);
	const [carregando,   setCarregando]   = useState(true);
	const [busca,        setBusca]        = useState("");
	const [filtroAtivo,  setFiltroAtivo]  = useState("todos");
	const [filtroStatus, setFiltroStatus] = useState([]);
	const [filtroTemp,   setFiltroTemp]   = useState({ status: [] });
	const [modalNovo,    setModalNovo]    = useState(false);
	const [modalEditar,  setModalEditar]  = useState(null);
	const [toast,        setToast]        = useState(null);
	const [loadingForm,  setLoadingForm]  = useState(false);

	const filtroDrop = useDropdown();
	const ativoDrop  = useDropdown();

	const carregar = useCallback(async () => {
		setCarregando(true);
		try {
			const data = await getCategorias();
			setCategorias(data);
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setCarregando(false);
		}
	}, []);

	useEffect(() => { carregar(); }, [carregar]);

	const aplicar = () => {
		setFiltroStatus(filtroTemp.status);
		filtroDrop.setOpen(false);
	};

	const toggleTemp = (val) =>
		setFiltroTemp((f) => ({
			status: f.status.includes(val) ? f.status.filter((x) => x !== val) : [...f.status, val],
		}));

	let dados = categorias.filter((c) => c.nome.toLowerCase().includes(busca.toLowerCase()));
	if (filtroAtivo === "ativos")   dados = dados.filter((c) => c.status === "disponivel");
	if (filtroAtivo === "inativos") dados = dados.filter((c) => c.status === "inativo");
	if (filtroStatus.length)        dados = dados.filter((c) => filtroStatus.includes(c.status));

	const handleNovo = async (form) => {
		setLoadingForm(true);
		try {
			const nova = await createCategoria({ name: form.nome, description: form.descricao });
			setCategorias((prev) => [...prev, { ...nova, imagem: form.imagem }]);
			setModalNovo(false);
			setToast({ msg: "Categoria adicionada com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	const handleEditar = async (form) => {
		setLoadingForm(true);
		try {
			const atualizada = await updateCategoria(modalEditar.id, { name: form.nome, description: form.descricao });
			setCategorias((prev) =>
				prev.map((c) => c.id === modalEditar.id ? { ...atualizada, imagem: form.imagem } : c)
			);
			setModalEditar(null);
			setToast({ msg: "Categoria editada com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Estoque &gt; Categorias</p>
			<h1 className={styles.titulo}>Categorias</h1>
			<p className={styles.subtitulo}>Gerencie as categorias de produtos e serviços</p>

			<div className={styles.controles}>
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon} />
					<input className={styles.busca} placeholder="Pesquisar Categorias" value={busca} onChange={(e) => setBusca(e.target.value)} />
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
							<p className={styles.filtroGrupoTitulo}>Status</p>
							{[{ val: "disponivel", label: "Disponível" }, { val: "inativo", label: "Inativo" }].map(({ val, label }) => (
								<label key={val} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.status.includes(val)} onChange={() => toggleTemp(val)} />
									{label}
								</label>
							))}
							<button className={styles.aplicarBtn} onClick={aplicar}><FiCheck size={12} /> Aplicar Filtro</button>
						</div>
					)}
				</div>

				<button className={styles.novoBtn} onClick={() => setModalNovo(true)}>+ Nova Categoria</button>
			</div>

			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Nome da Categoria</th>
							<th>Total de Produtos</th>
							<th>Status</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{carregando ? (
							<tr><td colSpan={4} className={styles.vazio}>Carregando...</td></tr>
						) : dados.length === 0 ? (
							<tr><td colSpan={4} className={styles.vazio}>Nenhuma categoria encontrada.</td></tr>
						) : dados.map((c) => (
							<tr key={c.id}>
								<td>
									<div className={styles.catCell}>
										<CatIcon />
										<span>{c.nome}</span>
									</div>
								</td>
								<td>{c.totalProdutos}</td>
								<td><StatusBadge status={c.status} /></td>
								<td>
									<button className={styles.editBtn} onClick={() => setModalEditar(c)} title="Editar categoria">
										<FiEdit2 size={15} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{modalNovo && (
				<Modal titulo="Nova categoria" subtitulo="*Preencha os dados da nova categoria" onClose={() => setModalNovo(false)}>
					<CategoriaForm labelBtn="Adicionar Categoria" onSubmit={handleNovo} loading={loadingForm} />
				</Modal>
			)}
			{modalEditar && (
				<Modal titulo="Editar categoria" subtitulo="*Edite os dados da categoria" onClose={() => setModalEditar(null)}>
					<CategoriaForm
						inicial={{ nome: modalEditar.nome, imagem: modalEditar.imagem, descricao: modalEditar.descricao }}
						labelBtn="Editar Categoria"
						onSubmit={handleEditar}
						loading={loadingForm}
					/>
				</Modal>
			)}

			{toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
		</main>
	);
}
