import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingCart, FiCheck } from "react-icons/fi";
import { useCarrinho } from "../../contexts/CarrinhoContext";
import { criarVenda } from "../../services/vendas";
import { apiFetch } from "../../services/api";
import { estaLogado } from "../../services/auth";
import styles from "./Carrinho.module.css";

const BRL = (v) => Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ETAPAS = ["Carrinho", "Entrega", "Pagamento"];

// ── formulário de entrega ──────────────────────────────────────────────────
function FormEntrega({ dados, onChange }) {
	const campos = [
		{ key: "nome",     label: "Nome completo*", type: "text",  placeholder: "Seu nome" },
		{ key: "email",    label: "E-mail*",         type: "email", placeholder: "seu@email.com" },
		{ key: "telefone", label: "Telefone*",        type: "tel",   placeholder: "(61) 99999-9999" },
		{ key: "cep",      label: "CEP*",             type: "text",  placeholder: "00000-000" },
		{ key: "endereco", label: "Endereço*",        type: "text",  placeholder: "Rua, número" },
		{ key: "bairro",   label: "Bairro*",          type: "text",  placeholder: "Bairro" },
		{ key: "cidade",   label: "Cidade*",          type: "text",  placeholder: "Cidade" },
		{ key: "estado",   label: "Estado*",          type: "text",  placeholder: "UF", maxLength: 2 },
	];
	return (
		<div className={styles.formGrid}>
			{campos.map(c => (
				<div key={c.key} className={`${styles.formGroup} ${c.key === "endereco" ? styles.fullWidth : ""}`}>
					<label>{c.label}</label>
					<input
						type={c.type}
						placeholder={c.placeholder}
						value={dados[c.key] || ""}
						maxLength={c.maxLength}
						onChange={e => onChange(c.key, e.target.value)}
						className={styles.input}
					/>
				</div>
			))}
		</div>
	);
}

// ── formulário de pagamento ────────────────────────────────────────────────
function FormPagamento({ metodo, onMetodo, dados, onChange }) {
	return (
		<div className={styles.pagamentoWrap}>
			<div className={styles.metodos}>
				{[
					{ key: "cartao", label: "Cartão de crédito" },
					{ key: "pix",    label: "PIX" },
					{ key: "boleto", label: "Boleto bancário" },
				].map(m => (
					<button
						key={m.key}
						type="button"
						className={`${styles.metodoBtn} ${metodo === m.key ? styles.metodoBtnAtivo : ""}`}
						onClick={() => onMetodo(m.key)}
					>
						{m.label}
					</button>
				))}
			</div>

			{metodo === "cartao" && (
				<div className={styles.formGrid}>
					<div className={`${styles.formGroup} ${styles.fullWidth}`}>
						<label>Número do cartão*</label>
						<input type="text" placeholder="0000 0000 0000 0000" maxLength={19}
							value={dados.numero || ""} onChange={e => onChange("numero", e.target.value)}
							className={styles.input}/>
					</div>
					<div className={styles.formGroup}>
						<label>Nome no cartão*</label>
						<input type="text" placeholder="Como está no cartão"
							value={dados.nome || ""} onChange={e => onChange("nome", e.target.value)}
							className={styles.input}/>
					</div>
					<div className={styles.formGroup}>
						<label>Validade*</label>
						<input type="text" placeholder="MM/AA" maxLength={5}
							value={dados.validade || ""} onChange={e => onChange("validade", e.target.value)}
							className={styles.input}/>
					</div>
					<div className={styles.formGroup}>
						<label>CVV*</label>
						<input type="text" placeholder="123" maxLength={3}
							value={dados.cvv || ""} onChange={e => onChange("cvv", e.target.value)}
							className={styles.input}/>
					</div>
					<div className={`${styles.formGroup} ${styles.fullWidth}`}>
						<label>Parcelas</label>
						<select className={styles.input} value={dados.parcelas || "1"} onChange={e => onChange("parcelas", e.target.value)}>
							{[1,2,3,6,12].map(n => <option key={n} value={n}>{n}x sem juros</option>)}
						</select>
					</div>
				</div>
			)}

			{metodo === "pix" && (
				<div className={styles.pixWrap}>
					<div className={styles.pixQR}><div className={styles.pixQRInner}>📱</div></div>
					<p className={styles.pixLabel}>Chave PIX: <strong>gestway@suporte.com.br</strong></p>
					<p className={styles.pixSub}>O pagamento será confirmado em até 5 minutos após o comprovante.</p>
				</div>
			)}

			{metodo === "boleto" && (
				<div className={styles.boletoWrap}>
					<p className={styles.boletoLabel}>O boleto será gerado após a confirmação do pedido.</p>
					<p className={styles.boletoSub}>Vencimento em 3 dias úteis.</p>
				</div>
			)}
		</div>
	);
}

// ── resumo lateral ─────────────────────────────────────────────────────────
function Resumo({ itens, total, voucher, onVoucher, desconto, loadingVoucher }) {
	const [inputVoucher, setInputVoucher] = useState("");

	return (
		<div className={styles.resumo}>
			<h3 className={styles.resumoTitulo}>Resumo do pedido</h3>

			<div className={styles.resumoItens}>
				{itens.map(i => (
					<div key={i.id} className={styles.resumoItem}>
						<div className={styles.resumoItemThumb}>
							{i.imagem ? <img src={i.imagem} alt={i.nome}/> : <span>{i.nome.charAt(0)}</span>}
						</div>
						<div className={styles.resumoItemInfo}>
							<p className={styles.resumoItemNome}>{i.nome}</p>
							<p className={styles.resumoItemQtd}>Qtd: {i.qtd}</p>
						</div>
						<p className={styles.resumoItemPreco}>{BRL(Number(i.preco) * i.qtd)}</p>
					</div>
				))}
			</div>

			<div className={styles.voucherWrap}>
				<input
					className={styles.voucherInput}
					placeholder="Código de voucher"
					value={inputVoucher}
					onChange={e => setInputVoucher(e.target.value.toUpperCase())}
				/>
				<button
					className={styles.voucherBtn}
					onClick={() => onVoucher(inputVoucher)}
					disabled={loadingVoucher}
				>
					{loadingVoucher ? "..." : "Aplicar"}
				</button>
			</div>

			{voucher && (
				<div className={styles.voucherAplicado}>
					✓ Voucher <strong>{voucher.codigo}</strong> — {voucher.desconto}% de desconto
				</div>
			)}

			<div className={styles.resumoTotais}>
				<div className={styles.resumoLinha}>
					<span>Subtotal</span><span>{BRL(total)}</span>
				</div>
				{desconto > 0 && (
					<div className={`${styles.resumoLinha} ${styles.resumoDesconto}`}>
						<span>Desconto</span><span>- {BRL(desconto)}</span>
					</div>
				)}
				<div className={styles.resumoLinha}>
					<span>Frete</span><span className={styles.resumoFrete}>Grátis</span>
				</div>
				<div className={`${styles.resumoLinha} ${styles.resumoTotal}`}>
					<span>Total</span><span>{BRL(total - desconto)}</span>
				</div>
			</div>
		</div>
	);
}

// ── página principal ───────────────────────────────────────────────────────
export default function Carrinho() {
	const navigate = useNavigate();
	const { itens, id: idCarrinho, remover, alterarQtd, limpar, total } = useCarrinho();

	const [etapa,         setEtapa]         = useState(0);
	const [entrega,       setEntrega]       = useState({});
	const [metodo,        setMetodo]        = useState("cartao");
	const [pagamento,     setPagamento]     = useState({});
	const [voucher,       setVoucher]       = useState(null);
	const [pedidoNum,     setPedidoNum]     = useState(null);
	const [loadingFinal,  setLoadingFinal]  = useState(false);
	const [loadingVoucher,setLoadingVoucher]= useState(false);
	const [erroFinal,     setErroFinal]     = useState(null);

	const logado = estaLogado();

	const desconto = voucher
		? total * (Number(voucher.desconto) / 100)
		: 0;

	// ── validar voucher via API ──────────────────────────────────────────
	const handleVoucher = async (codigo) => {
		if (!codigo) return;
		setLoadingVoucher(true);
		try {
			// tenta validar via API
			const data = await apiFetch(`/vouchers/validar/${codigo}`);
			setVoucher({ codigo, desconto: data.porcentagem_desconto_voucher ?? data.discount ?? 0 });
		} catch {
			// fallback: mock local para demo sem banco
			const MOCK = { "BEMVINDO10": 10, "GEST5": 5, "NIVER15": 15 };
			const pct  = MOCK[codigo];
			if (pct) setVoucher({ codigo, desconto: pct });
			else alert("Voucher inválido ou expirado.");
		} finally {
			setLoadingVoucher(false);
		}
	};

	// ── finalizar pedido ────────────────────────────────────────────────
	const handleFinalizar = async () => {
		setLoadingFinal(true);
		setErroFinal(null);

		const numeroPedido = `PED-${Date.now().toString().slice(-6)}`;

		try {
			if (logado && idCarrinho) {
				// usuário logado → cria venda real no banco
				await criarVenda({
					idCarrinho,
					numeroPedido,
					voucherCodigo: voucher?.codigo ?? null,
				});
			}
			// não logado → apenas confirma localmente (sem persistir)
			await limpar();
			setPedidoNum(numeroPedido);
			setEtapa(3);
		} catch (err) {
			setErroFinal(err.message ?? "Erro ao finalizar pedido. Tente novamente.");
		} finally {
			setLoadingFinal(false);
		}
	};

	const avancar = () => setEtapa(e => e + 1);
	const voltar  = () => etapa > 0 ? setEtapa(e => e - 1) : navigate("/");

	// ── confirmação ──────────────────────────────────────────────────────
	if (etapa === 3) {
		return (
			<div className={styles.page}>
				<div className={styles.confirmacaoWrap}>
					<div className={styles.confirmacaoIcon}><FiCheck size={40}/></div>
					<h1 className={styles.confirmacaoTitulo}>Pedido realizado!</h1>
					<p className={styles.confirmacaoNum}>Número do pedido: <strong>{pedidoNum}</strong></p>
					<p className={styles.confirmacaoDesc}>
						Você receberá um e-mail com os detalhes do seu pedido em breve.
					</p>
					<button className={styles.confirmacaoBtn} onClick={() => navigate("/")}>
						Continuar comprando
					</button>
				</div>
			</div>
		);
	}

	// ── carrinho vazio ───────────────────────────────────────────────────
	if (itens.length === 0 && etapa === 0) {
		return (
			<div className={styles.page}>
				<div className={styles.vazioWrap}>
					<FiShoppingCart size={48} className={styles.vazioIcon}/>
					<h2>Seu carrinho está vazio</h2>
					<p>Adicione produtos da nossa loja para continuar.</p>
					<button className={styles.voltarBtn} onClick={() => navigate("/")}>
						Ir para a loja
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<button className={styles.backBtn} onClick={voltar}>
					<FiArrowLeft size={16}/> {etapa === 0 ? "Voltar à loja" : "Voltar"}
				</button>
				<h1 className={styles.titulo}>Carrinho</h1>
			</div>

			<div className={styles.steps}>
				{ETAPAS.map((e, i) => (
					<div key={e} className={`${styles.step} ${i <= etapa ? styles.stepAtivo : ""}`}>
						<div className={styles.stepNum}>{i + 1}</div>
						<span>{e}</span>
						{i < 2 && <div className={`${styles.stepLine} ${i < etapa ? styles.stepLineAtivo : ""}`}/>}
					</div>
				))}
			</div>

			<div className={styles.layout}>
				<div className={styles.main}>
					{/* etapa 0: itens */}
					{etapa === 0 && (
						<div className={styles.itensList}>
							{itens.map(item => (
								<div key={item.id} className={styles.itemCard}>
									<div className={styles.itemThumb}>
										{item.imagem
											? <img src={item.imagem} alt={item.nome}/>
											: <span className={styles.itemLetra}>{item.nome.charAt(0)}</span>
										}
									</div>
									<div className={styles.itemInfo}>
										<p className={styles.itemNome}>{item.nome}</p>
										<p className={styles.itemCategoria}>{item.categoria}</p>
										{item.precoOld ? (
											<div className={styles.itemPrecos}>
												<span className={styles.itemPrecoOld}>{BRL(item.precoOld)} / un.</span>
												<span className={styles.itemPrecoUnit}>{BRL(item.preco)} / un.</span>
												<span className={styles.itemDescontoBadge}>
													{Math.round((1 - item.preco / item.precoOld) * 100)}% OFF
												</span>
											</div>
										) : (
											<p className={styles.itemPrecoUnit}>{BRL(item.preco)} / un.</p>
										)}
									</div>
									<div className={styles.itemControles}>
										<button onClick={() => alterarQtd(item.idProduto, item.qtd - 1)}><FiMinus size={13}/></button>
										<span>{item.qtd}</span>
										<button onClick={() => alterarQtd(item.idProduto, item.qtd + 1)}><FiPlus size={13}/></button>
									</div>
									<p className={styles.itemTotal}>{BRL(Number(item.preco) * item.qtd)}</p>
									<button className={styles.itemRemover} onClick={() => remover(item.idProduto)}>
										<FiTrash2 size={15}/>
									</button>
								</div>
							))}
						</div>
					)}

					{/* etapa 1: entrega */}
					{etapa === 1 && (
						<div className={styles.secao}>
							<h2 className={styles.secaoTitulo}>Dados de entrega</h2>
							<FormEntrega dados={entrega} onChange={(k, v) => setEntrega(p => ({ ...p, [k]: v }))}/>
						</div>
					)}

					{/* etapa 2: pagamento */}
					{etapa === 2 && (
						<div className={styles.secao}>
							<h2 className={styles.secaoTitulo}>Forma de pagamento</h2>
							<FormPagamento
								metodo={metodo}
								onMetodo={setMetodo}
								dados={pagamento}
								onChange={(k, v) => setPagamento(p => ({ ...p, [k]: v }))}
							/>
						</div>
					)}

					{erroFinal && (
						<p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "8px" }}>
							{erroFinal}
						</p>
					)}

					<div className={styles.acoes}>
						{etapa < 2 && (
							<button className={styles.proximoBtn} onClick={avancar} disabled={itens.length === 0}>
								{etapa === 0 ? "Ir para entrega" : "Ir para pagamento"}
							</button>
						)}
						{etapa === 2 && (
							<button
								className={styles.proximoBtn}
								onClick={handleFinalizar}
								disabled={loadingFinal}
							>
								{loadingFinal ? "Processando..." : "Finalizar pedido"}
							</button>
						)}
					</div>
				</div>

				<Resumo
					itens={itens}
					total={total}
					voucher={voucher}
					onVoucher={handleVoucher}
					desconto={desconto}
					loadingVoucher={loadingVoucher}
				/>
			</div>
		</div>
	);
}
