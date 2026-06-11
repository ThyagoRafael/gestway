import { useState, useRef, useEffect } from "react";
import {
	FiSearch, FiChevronDown, FiRefreshCw,
	FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import styles from "./Movimentacoes.module.css";

// ── mock ────────────────────────────────────────────────────────────────────
const MOCK = [
	{ id: 1, dataHora: "02/04/2026 - 09:14", produto: "Camisa Corinthians",  tipo: "Entrada", qtd: +10, motivo: "Compra (Fornecedor xyz)", responsavel: "Thyago C." },
	{ id: 2, dataHora: "02/04/2026 - 14:32", produto: "Plano Anti-Calvicie", tipo: "Saída",   qtd: -1,  motivo: "Venda (Pedido#0001)",    responsavel: "Pablo C."  },
	{ id: 3, dataHora: "03/04/2026 - 10:00", produto: "Taça Mundial P.",     tipo: "Ajuste",  qtd: 0,   motivo: "Correção de Inventário", responsavel: "Emerson S." },
];

const PERIODOS = [
	{ label: "Últimos 7 dias",  dias: 7   },
	{ label: "Últimos 30 dias", dias: 30  },
	{ label: "Últimos 90 dias", dias: 90  },
	{ label: "Este ano",        dias: 365 },
	{ label: "Todos",           dias: null },
];

const TIPOS = ["Entrada", "Saída", "Ajuste"];

const LINHAS_OPCOES = [5, 10, 20, 50];

const TIPO_COR = {
	Entrada: { badge: styles.badgeEntrada, dot: styles.dotEntrada },
	Saída:   { badge: styles.badgeSaida,   dot: styles.dotSaida   },
	Ajuste:  { badge: styles.badgeAjuste,  dot: styles.dotAjuste  },
};

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

// ── formata quantidade ───────────────────────────────────────────────────────
function fmtQtd(qtd) {
	if (qtd > 0) return `+${qtd}`;
	return String(qtd);
}

// ── página ──────────────────────────────────────────────────────────────────
export default function Movimentacoes() {
	const [busca,        setBusca]        = useState("");
	const [periodoIdx,   setPeriodoIdx]   = useState(1); // Últimos 30 dias
	const [tiposAtivos,  setTiposAtivos]  = useState(["Entrada", "Saída", "Ajuste"]);
	const [pagina,       setPagina]       = useState(1);
	const [linhasPorPag, setLinhasPorPag] = useState(20);
	const [tick,         setTick]         = useState(0); // força re-render no Atualizar

	const periodoDrop = useDropdown();
	const tipoDrop    = useDropdown();

	const toggleTipo = (t) =>
		setTiposAtivos((prev) =>
			prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
		);

	// filtragem
	let dados = [...MOCK];
	if (busca)               dados = dados.filter((m) => Object.values(m).join(" ").toLowerCase().includes(busca.toLowerCase()));
	if (tiposAtivos.length)  dados = dados.filter((m) => tiposAtivos.includes(m.tipo));

	const totalPaginas = Math.max(1, Math.ceil(dados.length / linhasPorPag));
	const dadosPag     = dados.slice((pagina - 1) * linhasPorPag, pagina * linhasPorPag);

	const handleAtualizar = () => {
		setPagina(1);
		setTick((t) => t + 1);
	};

	return (
		<div className={styles.wrapper}>
			<main className={styles.page}>
				{/* cabeçalho */}
				<p className={styles.breadcrumb}>🏠 &gt; Estoque &gt; Movimentações</p>
				<h1 className={styles.titulo}>Movimentações de estoque</h1>
				<p className={styles.subtitulo}>Histórico e auditoria de entradas, saídas e ajustes de produtos</p>

				{/* barra de filtros */}
				<div className={styles.filtros}>

					{/* busca */}
					<div className={styles.buscaWrap}>
						<FiSearch size={13} className={styles.buscaIcon}/>
						<input
							className={styles.busca}
							placeholder="Pesquisar Movimentações"
							value={busca}
							onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
						/>
					</div>

					{/* período */}
					<div className={styles.dropWrap} ref={periodoDrop.ref}>
						<button className={styles.filtroBtn} onClick={() => periodoDrop.setOpen((o) => !o)}>
							Período ({PERIODOS[periodoIdx].label}) <FiChevronDown size={13}/>
						</button>
						{periodoDrop.open && (
							<div className={styles.dropMenu}>
								{PERIODOS.map((p, i) => (
									<button
										key={i}
										className={`${styles.dropItem} ${periodoIdx === i ? styles.dropItemActive : ""}`}
										onClick={() => { setPeriodoIdx(i); periodoDrop.setOpen(false); setPagina(1); }}
									>
										{p.label}
									</button>
								))}
							</div>
						)}
					</div>

					{/* tipo */}
					<div className={styles.dropWrap} ref={tipoDrop.ref}>
						<button className={styles.filtroBtn} onClick={() => tipoDrop.setOpen((o) => !o)}>
							Tipo ({tiposAtivos.length === TIPOS.length ? "Entrada / saída / ajuste" : tiposAtivos.join(" / ")}) <FiChevronDown size={13}/>
						</button>
						{tipoDrop.open && (
							<div className={styles.dropMenu}>
								{TIPOS.map((t) => (
									<label key={t} className={styles.tipoItem}>
										<input
											type="checkbox"
											checked={tiposAtivos.includes(t)}
											onChange={() => { toggleTipo(t); setPagina(1); }}
										/>
										<span className={`${styles.badge} ${TIPO_COR[t].badge}`}>{t}</span>
									</label>
								))}
							</div>
						)}
					</div>

					{/* spacer */}
					<div className={styles.spacer}/>

					{/* atualizar */}
					<button className={styles.atualizarBtn} onClick={handleAtualizar}>
						<FiRefreshCw size={13}/> Atualizar
					</button>

					{/* nav rápida */}
					<div className={styles.navBtns}>
						<button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}><FiChevronLeft size={14}/></button>
						<button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}><FiChevronRight size={14}/></button>
					</div>
				</div>

				{/* tabela */}
				<div className={styles.tableWrap}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Data/Hora</th>
								<th>Produtos</th>
								<th>Tipo</th>
								<th>Qtd</th>
								<th>Motivo</th>
								<th>Responsável</th>
							</tr>
						</thead>
						<tbody>
							{dadosPag.length === 0 ? (
								<tr><td colSpan={6} className={styles.vazio}>Nenhuma movimentação encontrada.</td></tr>
							) : dadosPag.map((m) => (
								<tr key={m.id}>
									<td className={styles.tdData}>{m.dataHora}</td>
									<td>{m.produto}</td>
									<td>
										<span className={`${styles.badge} ${TIPO_COR[m.tipo].badge}`}>{m.tipo}</span>
									</td>
									<td className={`${styles.tdQtd} ${m.qtd > 0 ? styles.qtdPos : m.qtd < 0 ? styles.qtdNeg : styles.qtdZero}`}>
										{fmtQtd(m.qtd)}
									</td>
									<td>{m.motivo}</td>
									<td>{m.responsavel}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* rodapé */}
				<div className={styles.rodape}>
					<span className={styles.total}>{dados.length} de {MOCK.length} resultado(s)</span>

					<div className={styles.paginacao}>
						<label className={styles.linhasLabel}>
							Linhas por páginas:
							<select
								value={linhasPorPag}
								onChange={(e) => { setLinhasPorPag(Number(e.target.value)); setPagina(1); }}
								className={styles.linhasSelect}
							>
								{LINHAS_OPCOES.map((n) => <option key={n} value={n}>{n}</option>)}
							</select>
						</label>

						<span className={styles.paginaInfo}>Página {pagina} de {totalPaginas}</span>

						<div className={styles.paginaBtns}>
							<button onClick={() => setPagina(1)}                            disabled={pagina === 1}><FiChevronsLeft  size={13}/></button>
							<button onClick={() => setPagina((p) => p - 1)}                 disabled={pagina === 1}><FiChevronLeft   size={13}/></button>
							<button onClick={() => setPagina((p) => p + 1)}                 disabled={pagina === totalPaginas}><FiChevronRight  size={13}/></button>
							<button onClick={() => setPagina(totalPaginas)}                 disabled={pagina === totalPaginas}><FiChevronsRight size={13}/></button>
						</div>
					</div>
				</div>
			</main>

			{/* legenda lateral */}
			<aside className={styles.legenda}>
				<p className={styles.legendaTitulo}>Tipo movimentacao</p>
				{TIPOS.map((t) => (
					<div key={t} className={styles.legendaItem}>
						<span>{t}</span>
						<span className={`${styles.legendaDot} ${TIPO_COR[t].dot}`}/>
					</div>
				))}
			</aside>
		</div>
	);
}
