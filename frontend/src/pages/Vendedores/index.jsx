import { useState, useRef, useEffect, useCallback } from "react";
import { FiSearch, FiChevronDown, FiCheck, FiEdit2, FiX } from "react-icons/fi";
import { getVendedores, createVendedor, updateVendedor } from "../../services/vendedores";
import styles from "./Vendedores.module.css";

const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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

function ProgressBar({ valor, meta }) {
	const pct = meta > 0 ? Math.min(100, Math.round((valor / meta) * 100)) : 0;
	return (
		<div className={styles.progressWrap}>
			<span className={styles.progressFmt}>{fmt(meta)}</span>
			<div className={styles.progressBar}>
				<div className={styles.progressFill} style={{ width: `${pct}%` }} />
			</div>
			<span className={styles.progressPct}>{pct}%</span>
		</div>
	);
}

function ComissaoBadge({ vendedor }) {
	if (vendedor.statusComissao === "pendente") {
		return (
			<div>
				<div>{fmt(vendedor.comissaoMes)}</div>
				<span className={styles.badgePendente}>Esperando Aprovação</span>
			</div>
		);
	}
	return (
		<div>
			<div>{fmt(vendedor.comissaoMes)}</div>
			<div className={styles.comissaoPendente}>{fmt(vendedor.comissaoPendente)}</div>
		</div>
	);
}

function Avatar({ nome, foto }) {
	if (foto) return <img src={foto} alt={nome} className={styles.avatar} />;
	return (
		<div className={styles.avatarPlaceholder}>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="8" r="4" fill="#999" />
				<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#999" />
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

function VendedorForm({ inicial, onSubmit, labelBtn, loading }) {
	const [form, setForm] = useState(
		inicial ?? { nome: "", email: "", metaMes: "", taxaComissao: "", foto: null }
	);
	const [fotoPreview, setFotoPreview] = useState(inicial?.foto ?? null);
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const handleFoto = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		setFotoPreview(url);
		setForm((f) => ({ ...f, foto: url }));
	};

	return (
		<form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className={styles.form}>
			<label className={styles.label}>
				* Nome
				<input className={styles.input} value={form.nome} onChange={set("nome")} required />
			</label>

			<label className={styles.label}>
				* Endereço de E-mail
				<input className={styles.input} type="email" value={form.email} onChange={set("email")} required />
			</label>

			<div className={styles.formRow}>
				<label className={styles.label}>
					* Meta Mensal
					<div className={styles.inputPrefix}>
						<span>R$</span>
						<input className={styles.inputInner} type="number" min="0" value={form.metaMes} onChange={set("metaMes")} required />
					</div>
				</label>
				<label className={styles.label}>
					* Taxa de comissão
					<div className={styles.inputSuffix}>
						<input className={styles.inputInner} type="number" min="0" max="100" step="0.1" value={form.taxaComissao} onChange={set("taxaComissao")} required />
						<span>%</span>
					</div>
				</label>
			</div>

			<div className={styles.fotoSection}>
				<span className={styles.label}>Foto de Perfil</span>
				<div className={styles.fotoRow}>
					{fotoPreview
						? <img src={fotoPreview} alt="preview" className={styles.fotoPreview} />
						: <div className={styles.fotoPlaceholder}>
								<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
									<circle cx="12" cy="8" r="4" fill="#aaa" />
									<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#aaa" />
								</svg>
							</div>
					}
					<label className={styles.fotoBtn}>
						Adicionar Imagem
						<input type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleFoto} />
					</label>
					<span className={styles.fotoHint}>Formatos recomendados : JPG, PNG.<br />Tamanho máx : 10MB</span>
				</div>
			</div>

			<button type="submit" className={styles.submitBtn} disabled={loading}>
				{loading ? "Salvando..." : labelBtn}
			</button>
		</form>
	);
}

export default function Vendedores() {
	const [vendedores,    setVendedores]    = useState([]);
	const [carregando,    setCarregando]    = useState(true);
	const [busca,         setBusca]         = useState("");
	const [filtroAtivo,   setFiltroAtivo]   = useState("todos");
	const [filtroMeta,    setFiltroMeta]    = useState([]);
	const [filtroComissao,setFiltroComissao]= useState([]);
	const [filtroTemp,    setFiltroTemp]    = useState({ meta: [], comissao: [] });
	const [modalNovo,     setModalNovo]     = useState(false);
	const [modalEditar,   setModalEditar]   = useState(null);
	const [toast,         setToast]         = useState(null);
	const [loadingForm,   setLoadingForm]   = useState(false);

	const filtroDrop = useDropdown();
	const ativoDrop  = useDropdown();

	// ── carrega lista da API ─────────────────────────────
	const carregar = useCallback(async () => {
		setCarregando(true);
		try {
			const data = await getVendedores();
			setVendedores(data);
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setCarregando(false);
		}
	}, []);

	useEffect(() => { carregar(); }, [carregar]);

	// ── filtros ──────────────────────────────────────────
	const aplicar = () => {
		setFiltroMeta(filtroTemp.meta);
		setFiltroComissao(filtroTemp.comissao);
		filtroDrop.setOpen(false);
	};

	const toggleTemp = (grupo, val) =>
		setFiltroTemp((f) => ({
			...f,
			[grupo]: f[grupo].includes(val) ? f[grupo].filter((x) => x !== val) : [...f[grupo], val],
		}));

	let dados = vendedores.filter((v) => v.nome.toLowerCase().includes(busca.toLowerCase()));
	if (filtroMeta.length) {
		dados = dados.filter((v) => {
			const pct = v.metaMes > 0 ? v.vendaMes / v.metaMes : 0;
			if (filtroMeta.includes("acima")  && pct >= 1) return true;
			if (filtroMeta.includes("abaixo") && pct <  1) return true;
			return false;
		});
	}
	if (filtroComissao.length) dados = dados.filter((v) => filtroComissao.includes(v.statusComissao));

	// ── resumo ───────────────────────────────────────────
	const totalVendas        = vendedores.reduce((s, v) => s + v.vendaMes, 0);
	const mediaVendas        = vendedores.length ? totalVendas / vendedores.length : 0;
	const totalComissoes     = vendedores.reduce((s, v) => s + v.comissaoMes, 0);
	const comissoesPendentes = vendedores.filter((v) => v.statusComissao === "pendente")
		.reduce((s, v) => s + v.comissaoPendente, 0);

	// ── criar ────────────────────────────────────────────
	const handleNovo = async (form) => {
		setLoadingForm(true);
		try {
			const novo = await createVendedor({
				name:           form.nome,
				email:          form.email,
				monthlyTarget:  Number(form.metaMes),
				commissionRate: Number(form.taxaComissao),
			});
			setVendedores((prev) => [...prev, { ...novo, foto: form.foto }]);
			setModalNovo(false);
			setToast({ msg: "Vendedor adicionado com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	// ── editar ───────────────────────────────────────────
	const handleEditar = async (form) => {
		setLoadingForm(true);
		try {
			const atualizado = await updateVendedor(modalEditar.id, {
				name:           form.nome,
				email:          form.email,
				monthlyTarget:  Number(form.metaMes),
				commissionRate: Number(form.taxaComissao),
			});
			setVendedores((prev) =>
				prev.map((v) => v.id === modalEditar.id ? { ...atualizado, foto: form.foto } : v)
			);
			setModalEditar(null);
			setToast({ msg: "Vendedor editado com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Operacional &gt; Vendedores</p>
			<h1 className={styles.titulo}>Vendedores</h1>
			<p className={styles.subtitulo}>Gerenciamento de equipe, metas e desempenho</p>

			{/* controles */}
			<div className={styles.controles}>
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon} />
					<input className={styles.busca} placeholder="Pesquisar Vendedores" value={busca} onChange={(e) => setBusca(e.target.value)} />
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
							<p className={styles.filtroGrupoTitulo}>Meta do Mês</p>
							{[{ val: "acima", label: "Acima da meta" }, { val: "abaixo", label: "Abaixo da meta" }].map(({ val, label }) => (
								<label key={val} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.meta.includes(val)} onChange={() => toggleTemp("meta", val)} />
									{label}
								</label>
							))}
							<p className={styles.filtroGrupoTitulo} style={{ marginTop: 10 }}>Comissão</p>
							{[{ val: "pendente", label: "Esperando Aprovação" }, { val: "aprovado", label: "Aprovado" }].map(({ val, label }) => (
								<label key={val} className={styles.filtroItem}>
									<input type="checkbox" checked={filtroTemp.comissao.includes(val)} onChange={() => toggleTemp("comissao", val)} />
									{label}
								</label>
							))}
							<button className={styles.aplicarBtn} onClick={aplicar}><FiCheck size={12} /> Aplicar Filtro</button>
						</div>
					)}
				</div>

				<button className={styles.novoBtn} onClick={() => setModalNovo(true)}>+ Novo Vendedor</button>
			</div>

			{/* tabela */}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Vendendor</th>
							<th>Venda do mês</th>
							<th>Metas do mês</th>
							<th>Comissões mensais</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{carregando ? (
							<tr><td colSpan={5} className={styles.vazio}>Carregando...</td></tr>
						) : dados.length === 0 ? (
							<tr><td colSpan={5} className={styles.vazio}>Nenhum vendedor encontrado.</td></tr>
						) : dados.map((v) => (
							<tr key={v.id}>
								<td>
									<div className={styles.vendedorCell}>
										<Avatar nome={v.nome} foto={v.foto} />
										<span>{v.nome}</span>
									</div>
								</td>
								<td>
									<div>{fmt(v.vendaMes)}</div>
									<div className={styles.qtd}>{v.qtdVendas}</div>
								</td>
								<td><ProgressBar valor={v.vendaMes} meta={v.metaMes} /></td>
								<td><ComissaoBadge vendedor={v} /></td>
								<td>
									<button className={styles.editBtn} onClick={() => setModalEditar(v)} title="Editar vendedor">
										<FiEdit2 size={15} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* resumo */}
			<div className={styles.resumo}>
				<h3 className={styles.resumoTitulo}>Resumo do Time (Mês Atual)</h3>
				<hr className={styles.resumoHr} />
				<div className={styles.resumoGrid}>
					<span>Total Vendedores:</span>     <span>{vendedores.length}</span>
					<span>Total Vendas Time:</span>    <span>{fmt(totalVendas)}</span>
					<span>Média Vendas/Vendedor:</span><span>{fmt(mediaVendas)}</span>
					<span>Comissões Totais Mês:</span> <span>{fmt(totalComissoes)}</span>
					<span>Comissões Pendentes Aprovação:</span><span>{fmt(comissoesPendentes)}</span>
				</div>
				<button className={styles.verPedidos}>Visualizar Pedidos</button>
			</div>

			{/* modais */}
			{modalNovo && (
				<Modal titulo="Novo Vendedor" subtitulo="*Preencha os dados do novo Vendedor" onClose={() => setModalNovo(false)}>
					<VendedorForm labelBtn="Adicionar Vendedor" onSubmit={handleNovo} loading={loadingForm} />
				</Modal>
			)}
			{modalEditar && (
				<Modal titulo="Editar Vendedor" subtitulo="*Edite os dados do Vendedor" onClose={() => setModalEditar(null)}>
					<VendedorForm
						inicial={{ nome: modalEditar.nome, email: modalEditar.email, metaMes: modalEditar.metaMes, taxaComissao: modalEditar.taxaComissao, foto: modalEditar.foto }}
						labelBtn="Editar Vendedor"
						onSubmit={handleEditar}
						loading={loadingForm}
					/>
				</Modal>
			)}

			{toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
		</main>
	);
}
