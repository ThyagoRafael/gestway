import { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS, CategoryScale, LinearScale,
	PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { FiUsers, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { getDashboard } from "../../services/dashboard";
import styles from "./Dashboard.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const BRL = (v) => Number(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const MESES = ["Jan","Fev","Mar","Abr","Maio","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const CHART_DATA = {
	labels: MESES,
	datasets: [
		{ label: "Faturamento bruto", data: [62,58,67,72,75,80,78,82,76,70,68,65], borderColor: "#f5a623", backgroundColor: "transparent", borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.3 },
		{ label: "Margem de contribuição líquida", data: [38,35,40,42,44,46,43,45,41,39,37,36], borderColor: "#a855f7", backgroundColor: "transparent", borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.3 },
	],
};
const CHART_OPTIONS = {
	responsive: true, maintainAspectRatio: false,
	plugins: {
		legend: { position: "bottom", labels: { font: { size: 12 }, usePointStyle: true, pointStyleWidth: 20, boxHeight: 2 } },
		tooltip: { callbacks: { label: (ctx) => ` R$ ${(ctx.parsed.y * 1000).toLocaleString("pt-BR")},00` } },
	},
	scales: {
		x: { grid: { display: false }, ticks: { font: { size: 12 }, color: "#888" }, border: { display: false } },
		y: { grid: { color: "#f0f0f0" }, ticks: { font: { size: 12 }, color: "#888" }, border: { display: false }, min: 0, max: 100 },
	},
};

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

// ── card de stat com skeleton ────────────────────────────────────────────────
function StatCard({ label, value, trend, icon, loading }) {
	return (
		<div className={styles.statCard}>
			{icon && <div className={styles.statCardHeader}>{icon}<p className={styles.statLabel}>{label}</p></div>}
			{!icon && <p className={styles.statLabel}>{label}</p>}
			{loading
				? <div className={styles.skeleton} />
				: <p className={styles.statValue}>{value}</p>
			}
			<p className={styles.statTrend}>{trend}</p>
		</div>
	);
}

// ── banner de erro reutilizável ──────────────────────────────────────────────
function ErroBanner({ msg, onRetry }) {
	return (
		<div className={styles.erroBanner}>
			<FiAlertCircle size={18} />
			<span>{msg}</span>
			{onRetry && (
				<button className={styles.erroRetry} onClick={onRetry}>
					<FiRefreshCw size={13} /> Tentar novamente
				</button>
			)}
		</div>
	);
}

function RankingCard({ title, items, metaLabel, valorLabel, loading }) {
	const drop = useDropdown();
	const periodos = ["Último mês", "Último ano"];
	const [periodo, setPeriodo] = useState(periodos[0]);

	const max = items[0]?.[valorLabel] ?? 1;

	return (
		<div className={styles.rankingCard}>
			<div className={styles.rankingHeader}>
				<div>
					<h3>{title}</h3>
					<span className={styles.rankingMeta}>{metaLabel}</span>
				</div>
				<div className={styles.dropdown} ref={drop.ref}>
					<button className={styles.dropdownBtn} onClick={() => drop.setOpen((o) => !o)}>
						{periodo} <span className={styles.chevron}>&#8964;</span>
					</button>
					{drop.open && (
						<ul className={styles.dropdownMenu}>
							{periodos.map((p) => (
								<li key={p}><button onClick={() => { setPeriodo(p); drop.setOpen(false); }}>{p}</button></li>
							))}
						</ul>
					)}
				</div>
			</div>
			<ol className={styles.rankingList}>
				{loading ? (
					[1,2,3].map((i) => <li key={i} className={styles.rankingItem}><div className={styles.skeletonLine} /></li>)
				) : items.length === 0 ? (
					<li className={styles.rankingVazio}>Sem dados este mês.</li>
				) : items.slice(0, 3).map((item, i) => {
					const val = item[valorLabel] ?? 0;
					const pct = max > 0 ? Math.round((val / max) * 100) : 0;
					const label = valorLabel === "faturamento" ? `R$ ${BRL(val)}` : `${val} vendas`;
					return (
						<li key={i} className={styles.rankingItem}>
							<span className={styles.rankingPos}>{i + 1}.</span>
							<span className={styles.rankingNome}>{item.nome}</span>
							<div className={styles.barWrap}><div className={styles.bar} style={{ width: `${pct}%` }} /></div>
							<span className={styles.rankingValor}>{label}</span>
						</li>
					);
				})}
			</ol>
		</div>
	);
}

export default function Dashboard() {
	const [dados,   setDados]   = useState(null);
	const [loading, setLoading] = useState(true);
	const [erro,    setErro]    = useState(null);

	const carregar = () => {
		setLoading(true);
		setErro(null);
		getDashboard()
			.then((d) => {
				// normaliza campos que o backend pode retornar com nomes variados
				setDados({
					faturamentoMensal: d?.faturamentoMensal ?? d?.faturamento ?? 0,
					vendasRealizadas:  d?.vendasRealizadas  ?? d?.vendas      ?? 0,
					novosClientes:     d?.novosClientes     ?? d?.clientes     ?? 0,
					rankingVendedores: (d?.rankingVendedores ?? []).map((v) => ({
						nome:        v.nome ?? v.nome_completo_vendedor ?? "—",
						faturamento: Number(v.faturamento ?? v.total_liquido ?? 0),
					})),
					rankingProdutos: (d?.rankingProdutos ?? []).map((p) => ({
						nome:  p.nome ?? p.nome_produto ?? "—",
						vendas: Number(p.vendas ?? p.quantidade ?? 0),
					})),
				});
			})
			.catch((e) => setErro(e.message))
			.finally(() => setLoading(false));
	};

	useEffect(() => { carregar(); }, []);

	const faturamento    = dados?.faturamentoMensal ?? 0;
	const vendas         = dados?.vendasRealizadas  ?? 0;
	const clientes       = dados?.novosClientes     ?? 0;
	const rankVendedores = dados?.rankingVendedores ?? [];
	const rankProdutos   = dados?.rankingProdutos   ?? [];

	return (
		<main className={styles.page}>
			{/* erro de conexão — não esconde o resto da UI */}
			{erro && <ErroBanner msg={`Não foi possível carregar o dashboard: ${erro}`} onRetry={carregar} />}

			<section className={styles.statsRow}>
				<StatCard
					label="Faturamento mensal"
					value={`R$ ${BRL(faturamento)}`}
					trend="Mês atual"
					loading={loading}
				/>
				<StatCard
					label="Vendas realizadas"
					value={vendas}
					trend="Mês atual"
					loading={loading}
				/>
				<StatCard
					label="Novos clientes"
					value={clientes}
					trend="Neste mês"
					icon={<FiUsers size={22} />}
					loading={loading}
				/>
			</section>

			<section className={styles.chartCard}>
				<div className={styles.chartTitle}>
					<p>Faturamento e margem de contribuição - 12 meses</p>
					<span>Em milhares de R$</span>
				</div>
				<div className={styles.chartWrap}>
					<Line data={CHART_DATA} options={CHART_OPTIONS} />
				</div>
			</section>

			<section className={styles.bottomRow}>
				<RankingCard
					title="Ranking de vendedores"
					items={rankVendedores}
					metaLabel="Por faturamento este mês"
					valorLabel="faturamento"
					loading={loading}
				/>
				<RankingCard
					title="Produtos mais vendidos"
					items={rankProdutos}
					metaLabel="Por quantidade este mês"
					valorLabel="vendas"
					loading={loading}
				/>
			</section>
		</main>
	);
}
