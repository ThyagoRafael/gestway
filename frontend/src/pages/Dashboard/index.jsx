import { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { FiUsers } from "react-icons/fi";
import styles from "./Dashboard.module.css";

// registrar módulos do Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

// ── dados mock – substituir por chamada à API futuramente ──────────────────
const MESES = ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const FATURAMENTO = [62, 58, 67, 72, 75, 80, 78, 82, 76, 70, 68, 65];
const MARGEM      = [38, 35, 40, 42, 44, 46, 43, 45, 41, 39, 37, 36];

const RANKING_DATA = {
	"Último mês": {
		meta: "Meta mensal de R$ 5.000,00",
		items: [
			{ nome: "Pablo Carvalho",  valor: "R$ 7.000,00", pct: 100 },
			{ nome: "Emerson Son",     valor: "R$ 4.000,00", pct: 57  },
			{ nome: "Thyago Carvalho", valor: "R$ 3.000,00", pct: 43  },
		],
	},
	"Último ano": {
		meta: "Meta anual de R$ 60.000,00",
		items: [
			{ nome: "Pablo Carvalho",  valor: "R$ 84.000,00", pct: 100 },
			{ nome: "Emerson Son",     valor: "R$ 48.000,00", pct: 57  },
			{ nome: "Thyago Carvalho", valor: "R$ 36.000,00", pct: 43  },
		],
	},
};

const PRODUTOS_DATA = {
	"Último mês": {
		meta: "Meta mensal de 60 produtos",
		items: [
			{ nome: "Produto X", valor: "70 vendas", pct: 100 },
			{ nome: "Produto Y", valor: "60 vendas", pct: 86  },
			{ nome: "Produto Z", valor: "40 vendas", pct: 57  },
		],
	},
	"Último ano": {
		meta: "Meta anual de 720 produtos",
		items: [
			{ nome: "Produto X", valor: "840 vendas", pct: 100 },
			{ nome: "Produto Y", valor: "720 vendas", pct: 86  },
			{ nome: "Produto Z", valor: "480 vendas", pct: 57  },
		],
	},
};

const CHART_DATA = {
	labels: MESES,
	datasets: [
		{
			label: "Faturamento bruto",
			data: FATURAMENTO,
			borderColor: "#f5a623",
			backgroundColor: "transparent",
			borderWidth: 2,
			pointRadius: 0,
			pointHoverRadius: 5,
			tension: 0.3,
		},
		{
			label: "Margem de contribuição líquida",
			data: MARGEM,
			borderColor: "#a855f7",
			backgroundColor: "transparent",
			borderWidth: 2,
			pointRadius: 0,
			pointHoverRadius: 5,
			tension: 0.3,
		},
	],
};

const CHART_OPTIONS = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "bottom",
			labels: {
				font: { size: 12 },
				usePointStyle: true,
				pointStyleWidth: 20,
				boxHeight: 2,
			},
		},
		tooltip: {
			callbacks: {
				label: (ctx) =>
					` R$ ${(ctx.parsed.y * 1000).toLocaleString("pt-BR")},00`,
			},
		},
	},
	scales: {
		x: {
			grid: { display: false },
			ticks: { font: { size: 12 }, color: "#888" },
			border: { display: false },
		},
		y: {
			grid: { color: "#f0f0f0" },
			ticks: { font: { size: 12 }, color: "#888" },
			border: { display: false },
			min: 0,
			max: 100,
		},
	},
};

// ── card de ranking/produtos ───────────────────────────────────────────────
function RankingCard({ title, data }) {
	const periodos = Object.keys(data);
	const [periodo, setPeriodo] = useState(periodos[0]);
	const [open, setOpen] = useState(false);
	const atual = data[periodo];
	const ref = useRef(null);

	// fechar dropdown ao clicar fora
	useEffect(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<div className={styles.rankingCard}>
			<div className={styles.rankingHeader}>
				<div>
					<h3>{title}</h3>
					<span className={styles.rankingMeta}>{atual.meta}</span>
				</div>
				<div className={styles.dropdown} ref={ref}>
					<button
						className={styles.dropdownBtn}
						onClick={() => setOpen((o) => !o)}
					>
						{periodo} <span className={styles.chevron}>&#8964;</span>
					</button>
					{open && (
						<ul className={styles.dropdownMenu}>
							{periodos.map((p) => (
								<li key={p}>
									<button onClick={() => { setPeriodo(p); setOpen(false); }}>
										{p}
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<ol className={styles.rankingList}>
				{atual.items.map((item, i) => (
					<li key={i} className={styles.rankingItem}>
						<span className={styles.rankingPos}>{i + 1}.</span>
						<span className={styles.rankingNome}>{item.nome}</span>
						<div className={styles.barWrap}>
							<div className={styles.bar} style={{ width: `${item.pct}%` }} />
						</div>
						<span className={styles.rankingValor}>{item.valor}</span>
					</li>
				))}
			</ol>
		</div>
	);
}

// ── página principal ───────────────────────────────────────────────────────
export default function Dashboard() {
	return (
		<main className={styles.page}>
			{/* cards de topo */}
			<section className={styles.statsRow}>
				<div className={styles.statCard}>
					<p className={styles.statLabel}>Faturamento mensal</p>
					<p className={styles.statValue}>R$ 20.000,00</p>
					<p className={styles.statTrend}>
						<span className={styles.trendUp}>▲ +8%</span> vs mês anterior
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Vendas realizadas</p>
					<p className={styles.statValue}>70</p>
					<p className={styles.statTrend}>
						<span className={styles.trendUp}>▲ +2%</span> vs mês anterior
					</p>
				</div>

				<div className={styles.statCard}>
					<div className={styles.statCardHeader}>
						<FiUsers size={22} />
						<p className={styles.statLabel}>Novos clientes</p>
					</div>
					<p className={styles.statValue}>14</p>
					<p className={styles.statTrend}>Neste mês</p>
				</div>
			</section>

			{/* gráfico */}
			<section className={styles.chartCard}>
				<div className={styles.chartTitle}>
					<p>Faturamento e margem de contribuição - 12 meses</p>
					<span>Em milhares de R$</span>
				</div>
				<div className={styles.chartWrap}>
					<Line data={CHART_DATA} options={CHART_OPTIONS} />
				</div>
			</section>

			{/* cards inferiores */}
			<section className={styles.bottomRow}>
				<RankingCard title="Ranking de vendedores" data={RANKING_DATA} />
				<RankingCard title="Produtos mais vendidos" data={PRODUTOS_DATA} />
			</section>
		</main>
	);
}
