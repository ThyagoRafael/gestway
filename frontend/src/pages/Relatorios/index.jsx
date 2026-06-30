import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import {
	getRelatorioVendasMensais,
	getRelatorioInventario,
	getRelatorioDesempenhoVendedores,
	getRelatorioMovimentacoes,
} from "../../services/relatorios";
import styles from "./Relatorios.module.css";

// ── dados mock – trocar por fetch à API quando backend estiver pronto ──────

const MOCK_VENDAS_MENSAIS = [
	{ Dia: "01/04/2026", Faturamento: "R$ 1.200,00", Quantidade: 5, Vendedor: "Pablo C." },
	{ Dia: "02/04/2026", Faturamento: "R$ 980,00",   Quantidade: 3, Vendedor: "Thyago C." },
	{ Dia: "03/04/2026", Faturamento: "R$ 2.100,00", Quantidade: 8, Vendedor: "Emerson S." },
];

const MOCK_ESTOQUE = [
	{ Produto: "Kit Copo",          Categoria: "Utilidades", Quantidade: 42, "Valor Total": "R$ 1.260,00" },
	{ Produto: "Camisa Corinthians",Categoria: "Vestuário",  Quantidade: 18, "Valor Total": "R$ 1.800,00" },
	{ Produto: "Avaliação Física",  Categoria: "Serviços",   Quantidade: 10, "Valor Total": "R$ 3.000,00" },
];

const MOCK_VENDEDORES = [
	{ Vendedor: "Pablo Carvalho",  Vendas: 12, Faturamento: "R$ 7.000,00", Comissão: "R$ 700,00" },
	{ Vendedor: "Emerson Son",     Vendas: 8,  Faturamento: "R$ 4.000,00", Comissão: "R$ 400,00" },
	{ Vendedor: "Thyago Carvalho", Vendas: 6,  Faturamento: "R$ 3.000,00", Comissão: "R$ 300,00" },
];

const MOCK_MOVIMENTACOES = [
	{ Data: "01/04/2026", Produto: "Kit Copo",          Tipo: "Entrada", Quantidade: 20, Responsável: "Pablo C." },
	{ Data: "05/04/2026", Produto: "Camisa Corinthians",Tipo: "Saída",   Quantidade: 5,  Responsável: "Thyago C." },
	{ Data: "10/04/2026", Produto: "Avaliação Física",  Tipo: "Ajuste",  Quantidade: 2,  Responsável: "Emerson S." },
];

const RELATORIOS = [
	{
		id: "vendas",
		titulo: "Relatório de vendas mensais",
		descricao: "Resumo de faturamento e quantidade vendida por dia para o período selecionado",
		dados: MOCK_VENDAS_MENSAIS,
		nomeArquivo: "relatorio_vendas",
		fetchFn: getRelatorioVendasMensais,
	},
	{
		id: "estoque",
		titulo: "Inventário de estoque atual",
		descricao: "Lista completa de produtos, quantidade e valor total em estoque para o período selecionado",
		dados: MOCK_ESTOQUE,
		nomeArquivo: "inventario_estoque",
		fetchFn: getRelatorioInventario,
	},
	{
		id: "vendedores",
		titulo: "Desempenho de vendedores",
		descricao: "Ranking de vendas e comissões dos vendedores para o período selecionado",
		dados: MOCK_VENDEDORES,
		nomeArquivo: "desempenho_vendedores",
		fetchFn: getRelatorioDesempenhoVendedores,
	},
	{
		id: "movimentacoes",
		titulo: "Movimentações de estoque",
		descricao: "Entradas, saídas e ajustes de produtos para o período selecionado",
		dados: MOCK_MOVIMENTACOES,
		nomeArquivo: "movimentacoes_estoque",
		fetchFn: getRelatorioMovimentacoes,
	},
];

const PERIODOS = [
	"Mês Atual (Abril)",
	"Mês Anterior (Março)",
	"Último Trimestre",
	"Ano Atual",
	"Personalizado",
];

// ── mini calendário ────────────────────────────────────────────────────────
function Calendario({ value, onChange, onClose }) {
	const hoje = new Date();
	const parsed = value ? (() => { const [d,m,a] = value.split("/"); return new Date(a,m-1,d); })() : hoje;
	const [viewDate, setViewDate] = useState(parsed);

	const ano = viewDate.getFullYear();
	const mes = viewDate.getMonth();

	const MESES_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
	const DIAS_PT  = ["Do","Se","Te","Qu","Qu","Se","Sá"];

	const primeiroDia = new Date(ano, mes, 1).getDay();
	const diasNoMes   = new Date(ano, mes + 1, 0).getDate();

	const cells = [];
	for (let i = 0; i < primeiroDia; i++) cells.push(null);
	for (let d = 1; d <= diasNoMes; d++) cells.push(d);

	const selDia = parsed.getDate();
	const selMes = parsed.getMonth();
	const selAno = parsed.getFullYear();

	const escolher = (dia) => {
		const d = new Date(ano, mes, dia);
		onChange(d.toLocaleDateString("pt-BR"));
		onClose();
	};

	return (
		<div className={styles.cal}>
			<div className={styles.calHeader}>
				<button type="button" onClick={() => setViewDate(new Date(ano, mes - 1, 1))}>‹</button>
				<span>{MESES_PT[mes]} {ano}</span>
				<button type="button" onClick={() => setViewDate(new Date(ano, mes + 1, 1))}>›</button>
			</div>
			<div className={styles.calGrid}>
				{DIAS_PT.map((d, i) => <span key={i} className={styles.calDow}>{d}</span>)}
				{cells.map((dia, i) =>
					dia ? (
						<button key={i} type="button"
							className={`${styles.calDay} ${dia === selDia && mes === selMes && ano === selAno ? styles.calDaySel : ""}`}
							onClick={() => escolher(dia)}
						>{dia}</button>
					) : <span key={i} />
				)}
			</div>
		</div>
	);
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

// ── gerador de Excel ───────────────────────────────────────────────────────
function gerarExcel(relatorio, dataInicio, dataFim) {
	const wb = XLSX.utils.book_new();

	// aba de dados
	const ws = XLSX.utils.json_to_sheet(relatorio.dados);
	XLSX.utils.book_append_sheet(wb, ws, "Dados");

	// aba de metadados
	const meta = [
		{ Campo: "Relatório",      Valor: relatorio.titulo },
		{ Campo: "Período De",     Valor: dataInicio },
		{ Campo: "Período Até",    Valor: dataFim },
		{ Campo: "Gerado em",      Valor: new Date().toLocaleString("pt-BR") },
	];
	const wsMeta = XLSX.utils.json_to_sheet(meta);
	XLSX.utils.book_append_sheet(wb, wsMeta, "Informações");

	const nomeArquivo = `${relatorio.nomeArquivo}_${dataInicio.replace(/\//g,"-")}_${dataFim.replace(/\//g,"-")}.xlsx`;
	XLSX.writeFile(wb, nomeArquivo);

	return nomeArquivo;
}

// ── página principal ───────────────────────────────────────────────────────
export default function Relatorios() {
	const hoje    = new Date();
	const primDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toLocaleDateString("pt-BR");
	const ultDia  = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toLocaleDateString("pt-BR");

	const [periodo,    setPeriodo]    = useState(PERIODOS[0]);
	const [dataInicio, setDataInicio] = useState(primDia);
	const [dataFim,    setDataFim]    = useState(ultDia);
	const [historico,  setHistorico]  = useState([]);

	const periodoDrop = useDropdown();
	const calInicioDrop = useDropdown();
	const calFimDrop    = useDropdown();

	const handleGerar = async (relatorio) => {
		try {
			// tenta buscar da API; se falhar, usa mock
			const dadosReais = relatorio.fetchFn
				? await relatorio.fetchFn().catch(() => null)
				: null;
			const relatorioFinal = dadosReais
				? { ...relatorio, dados: dadosReais }
				: relatorio;
			const nomeArquivo = gerarExcel(relatorioFinal, dataInicio, dataFim);
			setHistorico(prev => [
				{ nome: relatorio.titulo, arquivo: nomeArquivo, hora: new Date().toLocaleTimeString("pt-BR") },
				...prev,
			]);
		} catch (e) {
			console.error("Erro ao gerar relatório:", e);
		}
	};

	return (
		<main className={styles.page}>
			{/* breadcrumb + cabeçalho */}
			<p className={styles.breadcrumb}>🏠 &gt; Gestão &gt; Relatórios</p>

			<div className={styles.topoRow}>
				<div>
					<h1 className={styles.titulo}>Relatórios</h1>
					<p className={styles.subtitulo}>Gerar relatórios rápidos do seu negócio.</p>
				</div>

				{/* filtro de período */}
				<div className={styles.filtroPeriodo}>
					<div className={styles.filtroPeriodoLabel}>Filtrar por data:</div>

					{/* dropdown período */}
					<div className={styles.dropWrap} ref={periodoDrop.ref}>
						<button className={styles.periodoBtn} onClick={() => periodoDrop.setOpen(o => !o)}>
							{periodo} <FiChevronDown size={13}/>
						</button>
						{periodoDrop.open && (
							<ul className={styles.periodoMenu}>
								{PERIODOS.map(p => (
									<li key={p}>
										<button onClick={() => { setPeriodo(p); periodoDrop.setOpen(false); }}>{p}</button>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* De */}
					<div className={styles.dataGrupo}>
						<span className={styles.dataLabel}>De:</span>
						<div className={styles.dropWrap} ref={calInicioDrop.ref}>
							<button className={styles.dataBtn} onClick={() => calInicioDrop.setOpen(o => !o)}>
								<FiCalendar size={13}/> {dataInicio}
							</button>
							{calInicioDrop.open && (
								<Calendario value={dataInicio} onChange={setDataInicio} onClose={() => calInicioDrop.setOpen(false)}/>
							)}
						</div>
					</div>

					{/* Até */}
					<div className={styles.dataGrupo}>
						<span className={styles.dataLabel}>Até:</span>
						<div className={styles.dropWrap} ref={calFimDrop.ref}>
							<button className={styles.dataBtn} onClick={() => calFimDrop.setOpen(o => !o)}>
								<FiCalendar size={13}/> {dataFim}
							</button>
							{calFimDrop.open && (
								<Calendario value={dataFim} onChange={setDataFim} onClose={() => calFimDrop.setOpen(false)}/>
							)}
						</div>
					</div>

					<button className={styles.filtrarBtn}>Filtrar</button>
				</div>
			</div>

			{/* lista de relatórios */}
			<div className={styles.listaCard}>
				{RELATORIOS.map((r, i) => (
					<div key={r.id}>
						<div className={styles.relatorioRow}>
							<div className={styles.relatorioInfo}>
								<h3>{r.titulo}</h3>
								<p>{r.descricao}</p>
							</div>
							<button className={styles.gerarBtn} onClick={() => handleGerar(r)}>
								Gerar
							</button>
						</div>
						{i < RELATORIOS.length - 1 && <hr className={styles.divisor}/>}
					</div>
				))}
			</div>

			{/* resumo de geração */}
			<div className={styles.resumoCard}>
				<h3 className={styles.resumoTitulo}>Resumo de Geração</h3>
				{historico.length === 0 ? (
					<p className={styles.resumoVazio}>Nenhum relatório gerado nesta sessão.</p>
				) : (
					<>
						<p className={styles.resumoInfo}>
							Relatórios Gerados (Período filtrado): <strong>{historico.length}</strong> &nbsp;|&nbsp;
							Módulo mais consultado: <strong>{(() => {
								const contagem = {};
								historico.forEach(h => { contagem[h.nome] = (contagem[h.nome] || 0) + 1; });
								return Object.entries(contagem).sort((a,b) => b[1]-a[1])[0][0].split(" ").slice(-1)[0];
							})()}</strong>
						</p>
						<ul className={styles.historicoLista}>
							{historico.map((h, i) => (
								<li key={i} className={styles.historicoItem}>
									<span>{h.nome}</span>
									<span className={styles.historicoArquivo}>{h.arquivo}</span>
									<span className={styles.historicoHora}>{h.hora}</span>
								</li>
							))}
						</ul>
					</>
				)}
				{historico.length > 0 && (
					<button className={styles.linkHistorico} onClick={() => setHistorico([])}>
						Limpar histórico de gerações
					</button>
				)}
			</div>
		</main>
	);
}
