import { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { getProdutos } from "../../services/produtos";
import styles from "./ModalSelecionarProduto.module.css";

const BRL = (v) => Number(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export default function ModalSelecionarProduto({ categoria, onConfirm, onClose }) {
	const [produtos,    setProdutos]    = useState([]);
	const [loading,     setLoading]     = useState(true);
	const [erro,        setErro]        = useState(null);
	const [selecionado, setSelecionado] = useState(null);
	const [busca,       setBusca]       = useState("");
	const bgRef = useRef(null);

	useEffect(() => {
		setLoading(true);
		getProdutos(categoria)
			.then(setProdutos)
			.catch(() => setErro("Erro ao carregar produtos."))
			.finally(() => setLoading(false));
	}, [categoria]);

	const filtrados = busca
		? produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
		: produtos;

	// garante que o produto confirmado tem precoOld e desconto
	const handleConfirmar = () => {
		if (!selecionado) return;
		// normaliza o produto para o shape que a LandingPage espera
		const produtoNormalizado = {
			...selecionado,
			// se precoOld não existir mas tiver desconto, reconstrói
			precoOld: selecionado.precoOld
				?? (selecionado.desconto > 0
					? Number(selecionado.preco) / (1 - selecionado.desconto / 100)
					: null),
			desconto: selecionado.desconto ?? 0,
		};
		onConfirm(produtoNormalizado);
		onClose();
	};

	return (
		<div className={styles.bg} ref={bgRef} onClick={e => e.target === bgRef.current && onClose()}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<div>
						<h2>Selecionar produto</h2>
						<p>Selecione o Produto para aparecer na Grid</p>
					</div>
					<button className={styles.closeBtn} onClick={onClose}><FiX size={18}/></button>
				</div>

				<div className={styles.produtoLabel}>Produto</div>
				<div className={styles.buscaWrap}>
					<input
						className={styles.busca}
						placeholder="Buscar produto..."
						value={busca}
						onChange={e => setBusca(e.target.value)}
					/>
					<FiChevronDown size={14} className={styles.buscaIcon}/>
				</div>

				<div className={styles.tableWrap}>
					{loading && <p className={styles.info}>Carregando...</p>}
					{erro    && <p className={styles.erro}>{erro}</p>}
					{!loading && !erro && (
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Nome</th>
									<th>Preço</th>
									<th>Desconto</th>
									<th>Estoque</th>
								</tr>
							</thead>
							<tbody>
								{filtrados.length === 0
									? <tr><td colSpan={4} className={styles.vazio}>Nenhum produto encontrado.</td></tr>
									: filtrados.map(p => {
										const temDesconto = p.desconto > 0;
										const precoFinal = temDesconto
											? Number(p.preco)
											: Number(p.preco);
										const precoOriginal = temDesconto
											? (p.precoOld ?? Number(p.preco) / (1 - p.desconto / 100))
											: null;

										return (
											<tr
												key={p.id}
												className={`${styles.row} ${selecionado?.id === p.id ? styles.rowSel : ""}`}
												onClick={() => setSelecionado(p)}
											>
												<td className={styles.tdNome}>
													<div className={styles.thumb}>
														{p.imagem
															? <img src={p.imagem} alt={p.nome}/>
															: <span className={styles.thumbLetra}>{p.nome.charAt(0)}</span>
														}
													</div>
													<span>{p.nome}</span>
												</td>
												<td>
													<div className={styles.precoWrap}>
														<span className={styles.precoFinal}>R$ {BRL(precoFinal)}</span>
														{precoOriginal && (
															<span className={styles.precoOld}>R$ {BRL(precoOriginal)}</span>
														)}
													</div>
												</td>
												<td>
													{temDesconto
														? <span className={styles.descontoBadge}>{p.desconto}% OFF</span>
														: <span className={styles.semDesconto}>—</span>
													}
												</td>
												<td className={styles.tdEstoque}>{p.estoqueAtual ?? p.estoque ?? 0} un.</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
					)}
				</div>

				<div className={styles.footer}>
					<button
						className={styles.confirmarBtn}
						onClick={handleConfirmar}
						disabled={!selecionado}
					>
						Adicionar Produto
					</button>
				</div>
			</div>
		</div>
	);
}
