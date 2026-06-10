import { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown, FiChevronUp, FiCalendar, FiCheck, FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Vendas.module.css";

// ── dados mock ─────────────────────────────────────────────────────────────
const VENDAS_MOCK = [
	{ id: "••••••••••••••••••••", status: "Recusado",   produto: "Kit Copo",          vendedor: "Pablo C.",   cliente: "Romulus",     criadoEm: "17/03/2026 - 13:03", atualizadoEm: "17/03/2026 - 13:03" },
	{ id: "••••••••••••••••••••", status: "Aprovado",   produto: "Camisa Corinthians", vendedor: "Thyago C.",  cliente: "João Silva",  criadoEm: "18/03/2026 - 10:15", atualizadoEm: "18/03/2026 - 10:15" },
	{ id: "••••••••••••••••••••", status: "Aguardando", produto: "Avaliação Física",   vendedor: "Emerson S.", cliente: "Maria Souza", criadoEm: "9/03/2026 - 16:40",  atualizadoEm: "19/03/2026 - 16:40" },
];

const TODAS_COLUNAS = [
	{ key: "id",           label: "Nº Pedido"        },
	{ key: "status",       label: "Status Pagamento" },
	{ key: "produto",      label: "Produtos"         },
	{ key: "vendedor",     label: "Vendedor"         },
	{ key: "cliente",      label: "Cliente"          },
	{ key: "criadoEm",     label: "Criado em"        },
	{ key: "atualizadoEm", label: "Atualizado em"    },
];

const STATUS_LIST = ["Aprovado", "Recusado", "Aguardando"];

const LINHAS_OPCOES = [5, 10, 20, 50];

// ── mini calendário ────────────────────────────────────────────────────────
function Calendario({ value, onChange, onClose }) {
	const hoje = new Date();
	const [viewDate, setViewDate] = useState(value ? new Date(value) : hoje);

	const ano  = viewDate.getFullYear();
	const mes  = viewDate.getMonth();

	const MESES_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
	const DIAS_PT  = ["Se","Te","Qu","Qu","Se","Sá","Do"];

	const primeiroDia = new Date(ano, mes, 1).getDay();
	const diasNoMes   = new Date(ano, mes + 1, 0).getDate();

	const cells = [];
	for (let i = 0; i < primeiroDia; i++) cells.push(null);
	for (let d = 1; d <= diasNoMes; d++) cells.push(d);

	const selDia = value ? new Date(value).getDate()  : null;
	const selMes = value ? new Date(value).getMonth() : null;
	const selAno = value ? new Date(value).getFullYear() : null;

	const navMes = (delta) => setViewDate(new Date(ano, mes + delta, 1));

	const escolher = (dia) => {
		const d = new Date(ano, mes, dia);
		onChange(d.toLocaleDateString("pt-BR"));
		onClose();
	};

	return (
		<div className={styles.cal}>
			<div className={styles.calHeader}>
				<button type="button" onClick={() => navMes(-1)}><FiChevronLeft size={14}/></button>
				<span>{MESES_PT[mes]} {ano}</span>
				<button type="button" onClick={() => navMes(1)}><FiChevronRight size={14}/></button>
			</div>
			<div className={styles.calGrid}>
				{DIAS_PT.map((d, i) => <span key={i} className={styles.calDow}>{d}</span>)}
				{cells.map((dia, i) =>
					dia ? (
						<button
							key={i}
							type="button"
							className={`${styles.calDay} ${dia === selDia && mes === selMes && ano === selAno ? styles.calDaySel : ""}`}
							onClick={() => escolher(dia)}
						>
							{dia}
						</button>
					) : <span key={i} />
				)}
			</div>
		</div>
	);
}

// ── dropdown genérico com fechar ao clicar fora ────────────────────────────
function useDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	return { open, setOpen, ref };
}

// ── badge de status ────────────────────────────────────────────────────────
function StatusBadge({ status }) {
	const map = {
		Aprovado:   styles.badgeAprovado,
		Recusado:   styles.badgeRecusado,
		Aguardando: styles.badgeAguardando,
	};
	return <span className={`${styles.badge} ${map[status] ?? ""}`}>{status}</span>;
}

// ── página principal ───────────────────────────────────────────────────────
export default function Vendas() {
	const [busca,          setBusca]          = useState("");
	const [dataFiltro,     setDataFiltro]     = useState("");
	const [statusFiltro,   setStatusFiltro]   = useState([]);
	const [colunasVisiveis,setColunasVisiveis]= useState(TODAS_COLUNAS.map(c => c.key));
	const [colunasTemp,    setColunasTemp]    = useState(colunasVisiveis);
	const [sortKey,        setSortKey]        = useState(null);
	const [sortDir,        setSortDir]        = useState("asc");
	const [pagina,         setPagina]         = useState(1);
	const [linhasPorPag,   setLinhasPorPag]   = useState(20);

	const calDrop    = useDropdown();
	const colDrop    = useDropdown();
	const statusDrop = useDropdown();

	// ordenação
	const toggleSort = (key) => {
		if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
		else { setSortKey(key); setSortDir("asc"); }
	};

	const SortIcon = ({ col }) => {
		if (sortKey !== col) return <span className={styles.sortNeutro}>↕</span>;
		return sortDir === "asc" ? <span className={styles.sortAtivo}>↑</span> : <span className={styles.sortAtivo}>↓</span>;
	};

	// toggle status filtro
	const toggleStatus = (s) =>
		setStatusFiltro(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

	// toggle coluna temp
	const toggleColunaTemp = (key) =>
		setColunasTemp(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

	// aplicar filtro de colunas
	const aplicarFiltro = () => {
		setColunasVisiveis(colunasTemp);
		colDrop.setOpen(false);
	};

	// filtrar dados
	let dados = [...VENDAS_MOCK];
	if (busca)              dados = dados.filter(v => Object.values(v).join(" ").toLowerCase().includes(busca.toLowerCase()));
	if (statusFiltro.length) dados = dados.filter(v => statusFiltro.includes(v.status));
	if (dataFiltro)         dados = dados.filter(v => v.criadoEm.startsWith(dataFiltro.split("/").reverse().join("-").substring(0,2)));

	if (sortKey) {
		dados.sort((a, b) => {
			const va = a[sortKey] ?? ""; const vb = b[sortKey] ?? "";
			return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
		});
	}

	const totalPaginas = Math.max(1, Math.ceil(dados.length / linhasPorPag));
	const dadosPag = dados.slice((pagina - 1) * linhasPorPag, pagina * linhasPorPag);

	return (
		<main className={styles.page}>
			{/* breadcrumb */}
			<p className={styles.breadcrumb}>🏠 &gt; Operacional &gt; Vendas</p>
			<h1 className={styles.titulo}>Vendas</h1>

			{/* barra de filtros */}
			<div className={styles.filtros}>

				{/* busca */}
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon}/>
					<input
						className={styles.busca}
						placeholder="Pesquise Aqui"
						value={busca}
						onChange={e => setBusca(e.target.value)}
					/>
				</div>

				{/* colunas */}
				<div className={styles.dropWrap} ref={colDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => colDrop.setOpen(o => !o)}>
						Colunas <FiChevronDown size={13}/>
					</button>
					{colDrop.open && (
						<div className={styles.colDropdown}>
							{TODAS_COLUNAS.map(c => (
								<label key={c.key} className={styles.colItem}>
									<span>{c.label}</span>
									<button
										type="button"
										className={`${styles.colToggle} ${colunasTemp.includes(c.key) ? styles.colToggleOn : ""}`}
										onClick={() => toggleColunaTemp(c.key)}
									>
										{colunasTemp.includes(c.key) && <FiCheck size={10}/>}
									</button>
								</label>
							))}
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
									<input
										type="checkbox"
										checked={statusFiltro.includes(s)}
										onChange={() => toggleStatus(s)}
									/>
									<StatusBadge status={s}/>
								</label>
							))}
						</div>
					)}
				</div>

				{/* data */}
				<div className={styles.dropWrap} ref={calDrop.ref}>
					<button className={styles.filtroBtn} onClick={() => calDrop.setOpen(o => !o)}>
						<FiCalendar size={13}/>
						{dataFiltro || new Date().toLocaleDateString("pt-BR")}
					</button>
					{calDrop.open && (
						<Calendario
							value={dataFiltro}
							onChange={setDataFiltro}
							onClose={() => calDrop.setOpen(false)}
						/>
					)}
				</div>

				{/* aplicar */}
				<button className={styles.aplicarBtn} onClick={aplicarFiltro}>
					<FiCheck size={13}/> Aplicar Filtro
				</button>
			</div>

			{/* tabela */}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							{TODAS_COLUNAS.filter(c => colunasVisiveis.includes(c.key)).map(c => (
								<th key={c.key}
									className={c.key === "criadoEm" || c.key === "atualizadoEm" ? styles.thSortable : ""}
									onClick={c.key === "criadoEm" || c.key === "atualizadoEm" ? () => toggleSort(c.key) : undefined}
								>
									{c.label}
									{(c.key === "criadoEm" || c.key === "atualizadoEm") && <SortIcon col={c.key}/>}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{dadosPag.length === 0 ? (
							<tr><td colSpan={colunasVisiveis.length} className={styles.vazio}>Nenhum resultado encontrado.</td></tr>
						) : dadosPag.map((v, i) => (
							<tr key={i}>
								{colunasVisiveis.includes("id")           && <td>{v.id}</td>}
								{colunasVisiveis.includes("status")       && <td><StatusBadge status={v.status}/></td>}
								{colunasVisiveis.includes("produto")      && <td>{v.produto}</td>}
								{colunasVisiveis.includes("vendedor")     && <td>{v.vendedor}</td>}
								{colunasVisiveis.includes("cliente")      && <td>{v.cliente}</td>}
								{colunasVisiveis.includes("criadoEm")     && <td>{v.criadoEm}</td>}
								{colunasVisiveis.includes("atualizadoEm") && <td>{v.atualizadoEm}</td>}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* rodapé */}
			<div className={styles.rodape}>
				<span className={styles.total}>{dados.length} de {VENDAS_MOCK.length} resultado(s)</span>

				<div className={styles.paginacao}>
					<label className={styles.linhasLabel}>
						Linhas por página:
						<select value={linhasPorPag} onChange={e => { setLinhasPorPag(Number(e.target.value)); setPagina(1); }} className={styles.linhasSelect}>
							{LINHAS_OPCOES.map(n => <option key={n} value={n}>{n}</option>)}
						</select>
					</label>

					<span className={styles.paginaInfo}>Página {pagina} de {totalPaginas}</span>

					<div className={styles.paginaBtns}>
						<button onClick={() => setPagina(1)}          disabled={pagina === 1}><FiChevronsLeft size={14}/></button>
						<button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}><FiChevronLeft  size={14}/></button>
						<button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}><FiChevronRight  size={14}/></button>
						<button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}><FiChevronsRight size={14}/></button>
					</div>
				</div>
			</div>
		</main>
	);
}
