import { useState, useEffect, useRef } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { getProdutos } from "../../services/produtos";
import styles from "./ModalSelecionarProduto.module.css";

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
					<input className={styles.busca} placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)}/>
					<FiChevronDown size={14} className={styles.buscaIcon}/>
				</div>

				<div className={styles.tableWrap}>
					{loading && <p className={styles.info}>Carregando...</p>}
					{erro    && <p className={styles.erro}>{erro}</p>}
					{!loading && !erro && (
						<table className={styles.table}>
							<thead><tr><th>Nome</th><th>Preço</th><th>Estoque</th></tr></thead>
							<tbody>
								{filtrados.length === 0
									? <tr><td colSpan={3} className={styles.vazio}>Nenhum produto encontrado.</td></tr>
									: filtrados.map(p => (
										<tr key={p.id}
											className={`${styles.row} ${selecionado?.id === p.id ? styles.rowSel : ""}`}
											onClick={() => setSelecionado(p)}
										>
											<td className={styles.tdNome}>
												<div className={styles.thumb}>
													{p.imagem ? <img src={p.imagem} alt={p.nome}/> : <span className={styles.thumbLetra}>{p.nome.charAt(0)}</span>}
												</div>
												{p.nome}
											</td>
											<td>R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
											<td className={styles.tdEstoque}>{p.estoque} unidades</td>
										</tr>
									))
								}
							</tbody>
						</table>
					)}
				</div>

				<div className={styles.footer}>
					<button className={styles.confirmarBtn} onClick={() => { if (selecionado) { onConfirm(selecionado); onClose(); } }} disabled={!selecionado}>
						Adicionar Produto
					</button>
				</div>
			</div>
		</div>
	);
}
