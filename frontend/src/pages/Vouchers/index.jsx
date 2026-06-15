import { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown, FiCheck, FiPlus, FiEdit2, FiTrash2,
         FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import styles from "./Vouchers.module.css";

// ── dados mock ─────────────────────────────────────────────────────────────
const MOCK_INICIAL = [
	{ id: 1, codigo: "BEMVIND0", desconto: "5%",  status: "Expirado", criadoEm: "10/04/2026", validade: "15/04/2026", descricao: "" },
	{ id: 2, codigo: "GEST5",    desconto: "10%", status: "Ativo",    criadoEm: "12/03/2026", validade: "20/09/2026", descricao: "" },
	{ id: 3, codigo: "NIVER15",  desconto: "15%", status: "Inativo",  criadoEm: "02/08/2025", validade: "17/08/2030", descricao: "" },
];

const STATUS_LIST   = ["Ativo", "Inativo", "Expirado"];
const LINHAS_OPCOES = [5, 10, 20, 50];

const TODAS_COLUNAS = [
	{ key: "codigo",   label: "Código do Cupom" },
	{ key: "desconto", label: "Desconto"        },
	{ key: "status",   label: "Status"          },
	{ key: "criadoEm", label: "Criado em"       },
	{ key: "validade", label: "Validade"        },
	{ key: "acoes",    label: "Ações"           },
];

// ── helpers ────────────────────────────────────────────────────────────────
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
	const map = { Ativo: styles.badgeAtivo, Inativo: styles.badgeInativo, Expirado: styles.badgeExpirado };
	return <span className={`${styles.badge} ${map[status] ?? ""}`}>{status}</span>;
}

// ── toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
	useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
	return (
		<div className={styles.toast}>
			<span className={styles.toastIcon}><FiCheck size={14}/></span>
			{msg}
		</div>
	);
}

// ── modal ──────────────────────────────────────────────────────────────────
const VAZIO = { codigo: "", desconto: "", criadoEm: "", validade: "", descricao: "" };

function Modal({ voucher, onSave, onClose }) {
	const editando = !!voucher;
	const [form, setForm] = useState(
		editando
			? { codigo: voucher.codigo, desconto: voucher.desconto.replace("%",""), criadoEm: voucher.criadoEm, validade: voucher.validade, descricao: voucher.descricao }
			: { ...VAZIO }
	);

	const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave({ ...form, desconto: form.desconto.includes("%") ? form.desconto : form.desconto + "%" });
	};

	// fechar ao clicar fora
	const bgRef = useRef(null);
	const onBgClick = (e) => { if (e.target === bgRef.current) onClose(); };

	return (
		<div className={styles.modalBg} ref={bgRef} onClick={onBgClick}>
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<div>
						<h2>{editando ? "Editar voucher" : "Novo voucher"}</h2>
						<p>*{editando ? "Edite" : "Preencha"} os dados do {editando ? "" : "novo "}voucher</p>
					</div>
					<button className={styles.modalClose} onClick={onClose}><FiX size={18}/></button>
				</div>

				<form onSubmit={handleSubmit} className={styles.modalForm}>
					<div className={styles.formGroup}>
						<label>* Código</label>
						<input value={form.codigo} onChange={e => set("codigo", e.target.value.toUpperCase())} required placeholder="Ex: BEMVIND0"/>
					</div>

					<div className={styles.formGroup}>
						<label>* Porcentagem de desconto</label>
						<input value={form.desconto} onChange={e => set("desconto", e.target.value)} required placeholder="Ex: 10" style={{maxWidth: 140}}/>
					</div>

					<div className={styles.formRow}>
						<div className={styles.formGroup}>
							<label>* Data de início</label>
							<input value={form.criadoEm} onChange={e => set("criadoEm", e.target.value)} required placeholder="DD/MM/AAAA"/>
						</div>
						<div className={styles.formGroup}>
							<label>* Validade</label>
							<input value={form.validade} onChange={e => set("validade", e.target.value)} required placeholder="DD/MM/AAAA"/>
						</div>
					</div>

					<div className={styles.formGroup}>
						<label>Descrição</label>
						<textarea
							value={form.descricao}
							onChange={e => e.target.value.length <= 250 && set("descricao", e.target.value)}
							placeholder=""
							rows={4}
						/>
						<span className={styles.charCount}>{form.descricao.length}/250</span>
					</div>

					<div className={styles.modalFooter}>
						<button type="submit" className={styles.submitBtn}>
							{editando ? "Editar Voucher" : "Adicionar Voucher"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// ── página principal ───────────────────────────────────────────────────────
export default function Vouchers() {
	const [vouchers,       setVouchers]       = useState(MOCK_INICIAL);
	const [busca,          setBusca]          = useState("");
	const [statusFiltro,   setStatusFiltro]   = useState([]);
	const [colunasVisiveis,setColunasVisiveis]= useState(TODAS_COLUNAS.map(c => c.key));
	const [colunasTemp,    setColunasTemp]    = useState(colunasVisiveis);
	const [sortKey,        setSortKey]        = useState(null);
	const [sortDir,        setSortDir]        = useState("asc");
	const [pagina,         setPagina]         = useState(1);
	const [linhasPorPag,   setLinhasPorPag]   = useState(20);
	const [modal,          setModal]          = useState(null); // null | "novo" | voucher
	const [toast,          setToast]          = useState(null);
	const [proximoId,      setProximoId]      = useState(4);

	const colDrop    = useDropdown();
	const statusDrop = useDropdown();

	const toggleSort = (key) => {
		if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
		else { setSortKey(key); setSortDir("asc"); }
	};

	const SortIcon = ({ col }) => {
		if (sortKey !== col) return <span className={styles.sortNeutro}>↕</span>;
		return sortDir === "asc" ? <span className={styles.sortAtivo}>↑</span> : <span className={styles.sortAtivo}>↓</span>;
	};

	const toggleStatus    = (s) => setStatusFiltro(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
	const toggleColunaTemp = (k) => setColunasTemp(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
	const aplicarFiltro   = () => { setColunasVisiveis(colunasTemp); colDrop.setOpen(false); };

	const handleSalvar = (form) => {
		if (modal === "novo") {
			setVouchers(p => [...p, { id: proximoId, ...form, status: "Ativo" }]);
			setProximoId(p => p + 1);
			setToast("Voucher adicionado com sucesso");
		} else {
			setVouchers(p => p.map(v => v.id === modal.id ? { ...v, ...form } : v));
			setToast("Voucher editado com sucesso");
		}
		setModal(null);
	};

	const handleExcluir = (id) => {
		setVouchers(p => p.filter(v => v.id !== id));
		setToast("Voucher excluído com sucesso");
	};

	// filtrar
	let dados = [...vouchers];
	if (busca)               dados = dados.filter(v => `${v.codigo} ${v.desconto} ${v.status}`.toLowerCase().includes(busca.toLowerCase()));
	if (statusFiltro.length) dados = dados.filter(v => statusFiltro.includes(v.status));
	if (sortKey)             dados.sort((a, b) => sortDir === "asc" ? (a[sortKey] ?? "").localeCompare(b[sortKey] ?? "") : (b[sortKey] ?? "").localeCompare(a[sortKey] ?? ""));

	const totalPaginas = Math.max(1, Math.ceil(dados.length / linhasPorPag));
	const dadosPag     = dados.slice((pagina - 1) * linhasPorPag, pagina * linhasPorPag);

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Operacional &gt; Vouchers</p>
			<h1 className={styles.titulo}>Vouchers</h1>
			<p className={styles.subtitulo}>Gerencie os vouchers de desconto disponíveis</p>

			{/* filtros */}
			<div className={styles.filtros}>
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon}/>
					<input className={styles.busca} placeholder="Pesquise Aqui" value={busca} onChange={e => setBusca(e.target.value)}/>
				</div>

				{/* colunas */}
				<div className={styles.dropWrap} ref={colDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => colDrop.setOpen(o => !o)}>
						Colunas <FiChevronDown size={13}/>
					</button>
					{colDrop.open && (
						<div className={styles.colDropdown}>
							{TODAS_COLUNAS.filter(c => c.key !== "acoes").map(c => (
								<label key={c.key} className={styles.colItem}>
									<span>{c.label}</span>
									<button type="button" className={`${styles.colToggle} ${colunasTemp.includes(c.key) ? styles.colToggleOn : ""}`} onClick={() => toggleColunaTemp(c.key)}>
										{colunasTemp.includes(c.key) && <FiCheck size={10}/>}
									</button>
								</label>
							))}
							<div className={styles.colAplicar}>
								<button onClick={aplicarFiltro} className={styles.aplicarBtn}><FiCheck size={12}/> Aplicar</button>
							</div>
						</div>
					)}
				</div>

				{/* status */}
				<div className={styles.dropWrap} ref={statusDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => statusDrop.setOpen(o => !o)}>
						Status <FiChevronDown size={13}/>
					</button>
					{statusDrop.open && (
						<div className={styles.statusDropdown}>
							{STATUS_LIST.map(s => (
								<label key={s} className={styles.statusItem}>
									<input type="checkbox" checked={statusFiltro.includes(s)} onChange={() => toggleStatus(s)}/>
									<StatusBadge status={s}/>
								</label>
							))}
						</div>
					)}
				</div>

				<button className={styles.novoBtn} onClick={() => setModal("novo")}>
					<FiPlus size={14}/> Novo Voucher
				</button>
			</div>

			{/* tabela */}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							{TODAS_COLUNAS.filter(c => colunasVisiveis.includes(c.key)).map(c => (
								<th key={c.key}
									className={c.key === "criadoEm" || c.key === "validade" ? styles.thSortable : ""}
									onClick={c.key === "criadoEm" || c.key === "validade" ? () => toggleSort(c.key) : undefined}
								>
									{c.label}
									{(c.key === "criadoEm" || c.key === "validade") && <SortIcon col={c.key}/>}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{dadosPag.length === 0 ? (
							<tr><td colSpan={colunasVisiveis.length} className={styles.vazio}>Nenhum resultado encontrado.</td></tr>
						) : dadosPag.map(v => (
							<tr key={v.id}>
								{colunasVisiveis.includes("codigo")   && <td>{v.codigo}</td>}
								{colunasVisiveis.includes("desconto") && <td>{v.desconto}</td>}
								{colunasVisiveis.includes("status")   && <td><StatusBadge status={v.status}/></td>}
								{colunasVisiveis.includes("criadoEm") && <td>{v.criadoEm}</td>}
								{colunasVisiveis.includes("validade") && <td>{v.validade}</td>}
								{colunasVisiveis.includes("acoes")    && (
									<td>
										<div className={styles.acoes}>
											<button className={styles.acaoBtn} onClick={() => setModal(v)} title="Editar"><FiEdit2 size={15}/></button>
											<button className={`${styles.acaoBtn} ${styles.acaoDel}`} onClick={() => handleExcluir(v.id)} title="Excluir"><FiTrash2 size={15}/></button>
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* rodapé */}
			<div className={styles.rodape}>
				<span className={styles.total}>{dados.length} de {vouchers.length} resultado(s)</span>
				<div className={styles.paginacao}>
					<select value={linhasPorPag} onChange={e => { setLinhasPorPag(Number(e.target.value)); setPagina(1); }} className={styles.linhasSelect}>
						{LINHAS_OPCOES.map(n => <option key={n} value={n}>{n}</option>)}
					</select>
					<span className={styles.paginaInfo}>Linhas por página &nbsp;|&nbsp; Página {pagina} de {totalPaginas}</span>
					<div className={styles.paginaBtns}>
						<button onClick={() => setPagina(1)}            disabled={pagina === 1}><FiChevronsLeft  size={14}/></button>
						<button onClick={() => setPagina(p => p - 1)}   disabled={pagina === 1}><FiChevronLeft   size={14}/></button>
						<button onClick={() => setPagina(p => p + 1)}   disabled={pagina === totalPaginas}><FiChevronRight  size={14}/></button>
						<button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}><FiChevronsRight size={14}/></button>
					</div>
				</div>
			</div>

			{/* modal */}
			{modal && <Modal voucher={modal === "novo" ? null : modal} onSave={handleSalvar} onClose={() => setModal(null)}/>}

			{/* toast */}
			{toast && <Toast msg={toast} onClose={() => setToast(null)}/>}
		</main>
	);
}
