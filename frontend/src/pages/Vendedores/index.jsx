import { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown, FiCheck, FiEdit2, FiX } from "react-icons/fi";
import styles from "./Vendedores.module.css";

// ── dados mock ──────────────────────────────────────────────────────────────
const VENDEDORES_MOCK = [
	{
		id: 1,
		nome: "Thyago C.",
		email: "thyago@gestway.com",
		vendaMes: 15000,
		qtdVendas: 42,
		metaMes: 20000,
		taxaComissao: 10,
		comissaoMes: 1500,
		comissaoPendente: 0,
		statusComissao: "aprovado",
		foto: null,
	},
	{
		id: 2,
		nome: "Pablo C.",
		email: "pablo@gestway.com",
		vendaMes: 15000,
		qtdVendas: 35,
		metaMes: 18000,
		taxaComissao: 8,
		comissaoMes: 1234500,
		comissaoPendente: 1234500,
		statusComissao: "pendente",
		foto: null,
	},
	{
		id: 3,
		nome: "Emerson S.",
		email: "emerson@gestway.com",
		vendaMes: 15000,
		qtdVendas: 21,
		metaMes: 15000,
		taxaComissao: 5,
		comissaoMes: 850,
		comissaoPendente: 0,
		statusComissao: "aprovado",
		foto: null,
	},
];

const fmt = (v) =>
	v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── hook dropdown com fechar ao clicar fora ─────────────────────────────────
function useDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	return { open, setOpen, ref };
}

// ── barra de progresso de meta ──────────────────────────────────────────────
function ProgressBar({ valor, meta }) {
	const pct = Math.min(100, Math.round((valor / meta) * 100));
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

// ── badge de comissão ───────────────────────────────────────────────────────
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

// ── avatar ──────────────────────────────────────────────────────────────────
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

// ── toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
	useEffect(() => {
		const t = setTimeout(onClose, 3000);
		return () => clearTimeout(t);
	}, [onClose]);

	return (
		<div className={styles.toast}>
			<span className={styles.toastIcon}>✓</span>
			<span>{msg}</span>
		</div>
	);
}

// ── modal ───────────────────────────────────────────────────────────────────
function Modal({ titulo, subtitulo, onClose, children }) {
	useEffect(() => {
		const handler = (e) => { if (e.key === "Escape") onClose(); };
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [onClose]);

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<button className={styles.modalClose} onClick={onClose}>
					<FiX size={18} />
				</button>
				<h2 className={styles.modalTitulo}>{titulo}</h2>
				<p className={styles.modalSub}>{subtitulo}</p>
				{children}
			</div>
		</div>
	);
}

// ── formulário compartilhado ────────────────────────────────────────────────
function VendedorForm({ inicial, onSubmit, labelBtn }) {
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

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<label className={styles.label}>
				* Nome
				<input
					className={styles.input}
					value={form.nome}
					onChange={set("nome")}
					required
					placeholder=""
				/>
			</label>

			<label className={styles.label}>
				* Endereço de E-mail
				<input
					className={styles.input}
					type="email"
					value={form.email}
					onChange={set("email")}
					required
					placeholder=""
				/>
			</label>

			<div className={styles.formRow}>
				<label className={styles.label}>
					* Meta Mensal
					<div className={styles.inputPrefix}>
						<span>R$</span>
						<input
							className={styles.inputInner}
							type="number"
							min="0"
							value={form.metaMes}
							onChange={set("metaMes")}
							required
						/>
					</div>
				</label>

				<label className={styles.label}>
					* Taxa de comissão
					<div className={styles.inputSuffix}>
						<input
							className={styles.inputInner}
							type="number"
							min="0"
							max="100"
							step="0.1"
							value={form.taxaComissao}
							onChange={set("taxaComissao")}
							required
						/>
						<span>%</span>
					</div>
				</label>
			</div>

			<div className={styles.fotoSection}>
				<span className={styles.label}>Foto de Perfil</span>
				<div className={styles.fotoRow}>
					{fotoPreview ? (
						<img src={fotoPreview} alt="preview" className={styles.fotoPreview} />
					) : (
						<div className={styles.fotoPlaceholder}>
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="8" r="4" fill="#aaa" />
								<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#aaa" />
							</svg>
						</div>
					)}
					<label className={styles.fotoBtn}>
						Adicionar Imagem
						<input
							type="file"
							accept="image/jpeg,image/png"
							style={{ display: "none" }}
							onChange={handleFoto}
						/>
					</label>
					<span className={styles.fotoHint}>
						Formatos recomendados : JPG, PNG.
						<br />
						Tamanho máx : 10MB
					</span>
				</div>
			</div>

			<button type="submit" className={styles.submitBtn}>
				{labelBtn}
			</button>
		</form>
	);
}

// ── página principal ────────────────────────────────────────────────────────
export default function Vendedores() {
	const [vendedores, setVendedores] = useState(VENDEDORES_MOCK);
	const [busca, setBusca] = useState("");
	const [filtroAtivo, setFiltroAtivo] = useState("todos"); // "todos" | "ativos" | "inativos"
	const [filtroMeta, setFiltroMeta] = useState([]); // "acima" | "abaixo"
	const [filtroComissao, setFiltroComissao] = useState([]); // "pendente" | "aprovado"
	const [filtroTemp, setFiltroTemp] = useState({ meta: [], comissao: [] });

	const [modalNovo, setModalNovo] = useState(false);
	const [modalEditar, setModalEditar] = useState(null); // vendedor ou null
	const [toast, setToast] = useState(null);

	const filtroDrop = useDropdown();
	const ativoDrop = useDropdown();

	// aplicar filtros
	const aplicar = () => {
		setFiltroMeta(filtroTemp.meta);
		setFiltroComissao(filtroTemp.comissao);
		filtroDrop.setOpen(false);
	};

	const toggleTemp = (grupo, val) =>
		setFiltroTemp((f) => ({
			...f,
			[grupo]: f[grupo].includes(val)
				? f[grupo].filter((x) => x !== val)
				: [...f[grupo], val],
		}));

	// filtragem
	let dados = vendedores.filter((v) =>
		v.nome.toLowerCase().includes(busca.toLowerCase())
	);
	if (filtroMeta.length) {
		dados = dados.filter((v) => {
			const pct = v.vendaMes / v.metaMes;
			if (filtroMeta.includes("acima") && pct >= 1) return true;
			if (filtroMeta.includes("abaixo") && pct < 1) return true;
			return false;
		});
	}
	if (filtroComissao.length) {
		dados = dados.filter((v) => filtroComissao.includes(v.statusComissao));
	}

	// resumo
	const totalVendas = vendedores.reduce((s, v) => s + v.vendaMes, 0);
	const mediaVendas = vendedores.length ? totalVendas / vendedores.length : 0;
	const totalComissoes = vendedores.reduce((s, v) => s + v.comissaoMes, 0);
	const comissoesPendentes = vendedores
		.filter((v) => v.statusComissao === "pendente")
		.reduce((s, v) => s + v.comissaoPendente, 0);

	// adicionar
	const handleNovo = (form) => {
		setVendedores((prev) => [
			...prev,
			{
				id: Date.now(),
				nome: form.nome,
				email: form.email,
				vendaMes: 0,
				qtdVendas: 0,
				metaMes: Number(form.metaMes),
				taxaComissao: Number(form.taxaComissao),
				comissaoMes: 0,
				comissaoPendente: 0,
				statusComissao: "aprovado",
				foto: form.foto,
			},
		]);
		setModalNovo(false);
		setToast("Vendedor adicionado com sucesso!");
	};

	// editar
	const handleEditar = (form) => {
		setVendedores((prev) =>
			prev.map((v) =>
				v.id === modalEditar.id
					? {
							...v,
							nome: form.nome,
							email: form.email,
							metaMes: Number(form.metaMes),
							taxaComissao: Number(form.taxaComissao),
							foto: form.foto,
					  }
					: v
			)
		);
		setModalEditar(null);
		setToast("Vendedor editado com sucesso!");
	};

	return (
		<main className={styles.page}>
			{/* breadcrumb */}
			<p className={styles.breadcrumb}>🏠 &gt; Operacional &gt; Vendedores</p>
			<h1 className={styles.titulo}>Vendedores</h1>
			<p className={styles.subtitulo}>Gerenciamento de equipe, metas e desempenho</p>

			{/* barra de controles */}
			<div className={styles.controles}>
				{/* busca */}
				<div className={styles.buscaWrap}>
					<FiSearch size={14} className={styles.buscaIcon} />
					<input
						className={styles.busca}
						placeholder="Pesquisar Vendedores"
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
				</div>

				{/* dropdown ativo/inativo */}
				<div className={styles.dropWrap} ref={ativoDrop.ref}>
					<button
						className={styles.selectBtn}
						onClick={() => ativoDrop.setOpen((o) => !o)}
					>
						{filtroAtivo === "todos"
							? "Ativos/Inativos"
							: filtroAtivo === "ativos"
							? "Ativos"
							: "Inativos"}
						<FiChevronDown size={13} />
					</button>
					{ativoDrop.open && (
						<div className={styles.dropMenu}>
							{["todos", "ativos", "inativos"].map((op) => (
								<button
									key={op}
									className={`${styles.dropItem} ${
										filtroAtivo === op ? styles.dropItemActive : ""
									}`}
									onClick={() => {
										setFiltroAtivo(op);
										ativoDrop.setOpen(false);
									}}
								>
									{op === "todos"
										? "Ativos/Inativos"
										: op.charAt(0).toUpperCase() + op.slice(1)}
									{filtroAtivo === op && <FiCheck size={12} />}
								</button>
							))}
						</div>
					)}
				</div>

				{/* filtro avançado */}
				<div className={styles.dropWrap} ref={filtroDrop.ref}>
					<button
						className={styles.filtroBtn}
						onClick={() => filtroDrop.setOpen((o) => !o)}
					>
						<span className={styles.filtroIcon}>⊞</span> Filtro
					</button>
					{filtroDrop.open && (
						<div className={styles.filtroDropdown}>
							<p className={styles.filtroGrupoTitulo}>Meta do Mês</p>
							{[
								{ val: "acima", label: "Acima da meta" },
								{ val: "abaixo", label: "Abaixo da meta" },
							].map(({ val, label }) => (
								<label key={val} className={styles.filtroItem}>
									<input
										type="checkbox"
										checked={filtroTemp.meta.includes(val)}
										onChange={() => toggleTemp("meta", val)}
									/>
									{label}
								</label>
							))}

							<p className={styles.filtroGrupoTitulo} style={{ marginTop: "10px" }}>
								Comissão
							</p>
							{[
								{ val: "pendente", label: "Esperando Aprovação" },
								{ val: "aprovado", label: "Aprovado" },
							].map(({ val, label }) => (
								<label key={val} className={styles.filtroItem}>
									<input
										type="checkbox"
										checked={filtroTemp.comissao.includes(val)}
										onChange={() => toggleTemp("comissao", val)}
									/>
									{label}
								</label>
							))}

							<button className={styles.aplicarBtn} onClick={aplicar}>
								<FiCheck size={12} /> Aplicar Filtro
							</button>
						</div>
					)}
				</div>

				{/* novo vendedor */}
				<button className={styles.novoBtn} onClick={() => setModalNovo(true)}>
					+ Novo Vendedor
				</button>
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
						{dados.length === 0 ? (
							<tr>
								<td colSpan={5} className={styles.vazio}>
									Nenhum vendedor encontrado.
								</td>
							</tr>
						) : (
							dados.map((v) => (
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
									<td>
										<ProgressBar valor={v.vendaMes} meta={v.metaMes} />
									</td>
									<td>
										<ComissaoBadge vendedor={v} />
									</td>
									<td>
										<button
											className={styles.editBtn}
											onClick={() => setModalEditar(v)}
											title="Editar vendedor"
										>
											<FiEdit2 size={15} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* resumo */}
			<div className={styles.resumo}>
				<h3 className={styles.resumoTitulo}>Resumo do Time (Mês Atual)</h3>
				<hr className={styles.resumoHr} />
				<div className={styles.resumoGrid}>
					<span>Total Vendedores:</span>
					<span>{vendedores.length}</span>

					<span>Total Vendas Time:</span>
					<span>{fmt(totalVendas)}</span>

					<span>Média Vendas/Vendedor:</span>
					<span>{fmt(mediaVendas)}</span>

					<span>Comissões Totais Mês:</span>
					<span>{fmt(totalComissoes)}</span>

					<span>Comissões Pendentes Aprovação:</span>
					<span>{fmt(comissoesPendentes)}</span>
				</div>
				<button className={styles.verPedidos}>Visualizar Pedidos</button>
			</div>

			{/* modal novo */}
			{modalNovo && (
				<Modal
					titulo="Novo Vendedor"
					subtitulo="*Preencha os dados do novo Vendedor"
					onClose={() => setModalNovo(false)}
				>
					<VendedorForm labelBtn="Adicionar Vendedor" onSubmit={handleNovo} />
				</Modal>
			)}

			{/* modal editar */}
			{modalEditar && (
				<Modal
					titulo="Editar Vendedor"
					subtitulo="*Edite os dados do Vendedor"
					onClose={() => setModalEditar(null)}
				>
					<VendedorForm
						inicial={{
							nome: modalEditar.nome,
							email: modalEditar.email,
							metaMes: modalEditar.metaMes,
							taxaComissao: modalEditar.taxaComissao,
							foto: modalEditar.foto,
						}}
						labelBtn="Editar Vendedor"
						onSubmit={handleEditar}
					/>
				</Modal>
			)}

			{/* toast */}
			{toast && <Toast msg={toast} onClose={() => setToast(null)} />}
		</main>
	);
}
