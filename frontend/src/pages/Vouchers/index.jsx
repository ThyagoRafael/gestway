import { useState, useRef, useEffect, useCallback } from "react";
import {
	FiSearch, FiChevronDown, FiCheck, FiPlus, FiEdit2, FiTrash2,
	FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight, FiX,
} from "react-icons/fi";
import { getVouchers, createVoucher, updateVoucher } from "../../services/vouchers";
import styles from "./Vouchers.module.css";

const STATUS_LIST   = ["Ativo", "Inativo", "Expirado"];
const LINHAS_OPCOES = [5, 10, 20, 50];

const TODAS_COLUNAS = [
	{ key: "code",   label: "Código do Cupom" },
	{ key: "discount", label: "Desconto"        },
	{ key: "status",   label: "Status"          },
	{ key: "criadoEm", label: "Criado em"       },
	{ key: "validade", label: "Validade"        },
	{ key: "acoes",    label: "Ações"           },
];

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

// converte "DD/MM/YYYY" → "YYYY-MM-DD" para enviar ao backend
function brToIso(dataBr) {
	if (!dataBr) return "";
	const [d, m, y] = dataBr.split("/");
	return `${y}-${m}-${d}`;
}

function VoucherModal({ inicial, onClose, onSalvar, loading }) {
	const empty = { code: "", discount: "", initialDate: "", expirationDate: "", description: "" };
	const [form, setForm] = useState(
		inicial
			? {
				code:         inicial.code,
				discount:       String(inicial.discount_raw),
				initialDate:    inicial.initialDate?.slice(0, 10) ?? "",
				expirationDate: inicial.expirationDate?.slice(0, 10) ?? "",
				description:      inicial.description,
			}
			: empty
	);
	const descMax = 250;
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	useEffect(() => {
		const h = (e) => { if (e.key === "Escape") onClose(); };
		document.addEventListener("keydown", h);
		return () => document.removeEventListener("keydown", h);
	}, [onClose]);

	return (
		<div className={styles.modalBg} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<div>
						<h2>{inicial ? "Editar Voucher" : "Novo Voucher"}</h2>
						<p>{inicial ? "*Edite os dados do voucher" : "*Preencha os dados do novo voucher"}</p>
					</div>
					<button className={styles.modalClose} onClick={onClose}><FiX size={18} /></button>
				</div>

				<form className={styles.modalForm} onSubmit={(e) => { e.preventDefault(); onSalvar(form); }}>
					<div className={styles.formGroup}>
						<label>* Código do cupom</label>
						<input value={form.code} onChange={set("code")} required placeholder="Ex: BEMVINDO10" />
					</div>

					<div className={styles.formRow}>
						<div className={styles.formGroup}>
							<label>* Desconto (%)</label>
							<input type="number" min="1" max="100" step="0.1" value={form.discount} onChange={set("discount")} required />
						</div>
						<div className={styles.formGroup} />
					</div>

					<div className={styles.formRow}>
						<div className={styles.formGroup}>
							<label>* Data inicial</label>
							<input type="date" value={form.initialDate} onChange={set("initialDate")} required />
						</div>
						<div className={styles.formGroup}>
							<label>* Data de validade</label>
							<input type="date" value={form.expirationDate} onChange={set("expirationDate")} required />
						</div>
					</div>

					<div className={styles.formGroup} style={{ position: "relative" }}>
						<label>Descrição</label>
						<textarea
							maxLength={descMax}
							value={form.description}
							onChange={set("description")}
							rows={3}
						/>
						<span className={styles.charCount}>{form.description.length}/{descMax}</span>
					</div>

					<div className={styles.modalFooter}>
						<button type="submit" className={styles.submitBtn} disabled={loading}>
							{loading ? "Salvando..." : inicial ? "Editar Voucher" : "Adicionar Voucher"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function Vouchers() {
	const [vouchers,     setVouchers]     = useState([]);
	const [carregando,   setCarregando]   = useState(true);
	const [busca,        setBusca]        = useState("");
	const [filtroStatus, setFiltroStatus] = useState([]);
	const [colunas,      setColunas]      = useState(TODAS_COLUNAS.map((c) => c.key));
	const [pagina,       setPagina]       = useState(1);
	const [linhasPorPag, setLinhasPorPag] = useState(10);
	const [sortKey,      setSortKey]      = useState("criadoEm");
	const [sortAsc,      setSortAsc]      = useState(false);
	const [modalNovo,    setModalNovo]    = useState(false);
	const [modalEditar,  setModalEditar]  = useState(null);
	const [toast,        setToast]        = useState(null);
	const [loadingForm,  setLoadingForm]  = useState(false);

	const colDrop    = useDropdown();
	const statusDrop = useDropdown();

	const carregar = useCallback(async () => {
		setCarregando(true);
		try {
			const data = await getVouchers();
			setVouchers(data);
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setCarregando(false);
		}
	}, []);

	useEffect(() => { carregar(); }, [carregar]);

	const toggleStatus = (s) =>
		setFiltroStatus((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

	const toggleColuna = (k) =>
		setColunas((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);

	const handleSort = (k) => {
		if (sortKey === k) setSortAsc((a) => !a);
		else { setSortKey(k); setSortAsc(true); }
		setPagina(1);
	};

	let dados = vouchers.filter((v) =>
		[v.code, v.discount, v.status].join(" ").toLowerCase().includes(busca.toLowerCase())
	);
	if (filtroStatus.length) dados = dados.filter((v) => filtroStatus.includes(v.status));

	dados = [...dados].sort((a, b) => {
		const av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
		return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
	});

	const totalPaginas = Math.max(1, Math.ceil(dados.length / linhasPorPag));
	const dadosPag     = dados.slice((pagina - 1) * linhasPorPag, pagina * linhasPorPag);
	const colsVisiveis = TODAS_COLUNAS.filter((c) => colunas.includes(c.key));

	const handleNovo = async (form) => {
		setLoadingForm(true);
		try {
			const novo = await createVoucher({
				code:           form.code,
				discount:       Number(form.discount),
				initialDate:    form.initialDate,
				expirationDate: form.expirationDate,
				description:    form.description,
			});
			setVouchers((prev) => [novo, ...prev]);
			setModalNovo(false);
			setToast({ msg: "Voucher adicionado com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	const handleEditar = async (form) => {
		setLoadingForm(true);
		try {
			const atualizado = await updateVoucher(modalEditar.id, {
				code:           form.code,
				discount:       Number(form.discount),
				initialDate:    form.initialDate,
				expirationDate: form.expirationDate,
				description:    form.description,
			});
			setVouchers((prev) => prev.map((v) => v.id === modalEditar.id ? atualizado : v));
			setModalEditar(null);
			setToast({ msg: "Voucher editado com sucesso!", tipo: "sucesso" });
		} catch (err) {
			setToast({ msg: err.message, tipo: "erro" });
		} finally {
			setLoadingForm(false);
		}
	};

	return (
		<div className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Gestão &gt; Vouchers</p>
			<h1 className={styles.titulo}>Vouchers</h1>
			<p className={styles.subtitulo}>Gerencie cupons de desconto</p>

			{/* filtros */}
			<div className={styles.filtros}>
				<div className={styles.buscaWrap}>
					<FiSearch size={13} className={styles.buscaIcon} />
					<input
						className={styles.busca}
						placeholder="Pesquisar vouchers"
						value={busca}
						onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
					/>
				</div>

				{/* colunas */}
				<div className={styles.dropWrap} ref={colDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => colDrop.setOpen((o) => !o)}>
						Colunas <FiChevronDown size={13} />
					</button>
					{colDrop.open && (
						<div className={styles.colDropdown}>
							{TODAS_COLUNAS.map((c) => (
								<div key={c.key} className={styles.colItem}>
									<span>{c.label}</span>
									<div
										className={`${styles.colToggle} ${colunas.includes(c.key) ? styles.colToggleOn : ""}`}
										onClick={() => toggleColuna(c.key)}
									>
										{colunas.includes(c.key) && <FiCheck size={11} />}
									</div>
								</div>
							))}
							<div className={styles.colAplicar}>
								<button className={styles.aplicarBtn} onClick={() => colDrop.setOpen(false)}>
									<FiCheck size={12} /> Aplicar
								</button>
							</div>
						</div>
					)}
				</div>

				{/* status */}
				<div className={styles.dropWrap} ref={statusDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => statusDrop.setOpen((o) => !o)}>
						Status <FiChevronDown size={13} />
					</button>
					{statusDrop.open && (
						<div className={styles.statusDropdown}>
							{STATUS_LIST.map((s) => (
								<label key={s} className={styles.statusItem}>
									<input type="checkbox" checked={filtroStatus.includes(s)} onChange={() => toggleStatus(s)} />
									<StatusBadge status={s} />
								</label>
							))}
						</div>
					)}
				</div>

				<button className={styles.novoBtn} onClick={() => setModalNovo(true)}>
					<FiPlus size={14} /> Novo Voucher
				</button>
			</div>

			{/* tabela */}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							{colsVisiveis.map((c) => (
								<th
									key={c.key}
									className={c.key !== "acoes" ? styles.thSortable : ""}
									onClick={() => c.key !== "acoes" && handleSort(c.key)}
								>
									{c.label}
									{c.key !== "acoes" && (
										<span className={sortKey === c.key ? styles.sortAtivo : styles.sortNeutro}>
											{sortKey === c.key ? (sortAsc ? " ▲" : " ▼") : " ↕"}
										</span>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{carregando ? (
							<tr><td colSpan={colsVisiveis.length} className={styles.vazio}>Carregando...</td></tr>
						) : dadosPag.length === 0 ? (
							<tr><td colSpan={colsVisiveis.length} className={styles.vazio}>Nenhum voucher encontrado.</td></tr>
						) : dadosPag.map((v) => (
							<tr key={v.id}>
								{colsVisiveis.map((c) => {
									if (c.key === "status")  return <td key={c.key}><StatusBadge status={v.status} /></td>;
									if (c.key === "acoes") return (
										<td key={c.key}>
											<div className={styles.acoes}>
												<button className={styles.acaoBtn} onClick={() => setModalEditar(v)} title="Editar"><FiEdit2 size={14} /></button>
											</div>
										</td>
									);
									return <td key={c.key}>{v[c.key] ?? "—"}</td>;
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* rodapé */}
			<div className={styles.rodape}>
				<span>{dados.length} resultado(s)</span>
				<div className={styles.paginacao}>
					<select value={linhasPorPag} onChange={(e) => { setLinhasPorPag(Number(e.target.value)); setPagina(1); }} className={styles.linhasSelect}>
						{LINHAS_OPCOES.map((n) => <option key={n} value={n}>{n}</option>)}
					</select>
					<span className={styles.paginaInfo}>Página {pagina} de {totalPaginas}</span>
					<div className={styles.paginaBtns}>
						<button onClick={() => setPagina(1)}               disabled={pagina === 1}><FiChevronsLeft  size={13} /></button>
						<button onClick={() => setPagina((p) => p - 1)}    disabled={pagina === 1}><FiChevronLeft   size={13} /></button>
						<button onClick={() => setPagina((p) => p + 1)}    disabled={pagina === totalPaginas}><FiChevronRight  size={13} /></button>
						<button onClick={() => setPagina(totalPaginas)}    disabled={pagina === totalPaginas}><FiChevronsRight size={13} /></button>
					</div>
				</div>
			</div>

			{modalNovo    && <VoucherModal onClose={() => setModalNovo(false)}    onSalvar={handleNovo}   loading={loadingForm} />}
			{modalEditar  && <VoucherModal inicial={modalEditar} onClose={() => setModalEditar(null)} onSalvar={handleEditar} loading={loadingForm} />}

			{toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
		</div>
	);
}
