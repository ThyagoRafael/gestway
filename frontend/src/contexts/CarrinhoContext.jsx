import { createContext, useContext, useEffect, useState } from "react";
import {
	getCarrinho,
	addItem,
	updateItem,
	removeItem,
	clearCarrinho,
} from "../services/carrinho";
import { estaLogado } from "../services/auth";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
	const logado = estaLogado();

	const [carrinho, setCarrinho] = useState({
		id: null,
		status: "ABERTO",
		itens: [],
		total: 0,
		qtdTotal: 0,
	});

	const [loading, setLoading] = useState(logado); // só carrega se logado

	// ── carrega do backend quando logado ─────────────────
	useEffect(() => {
		if (!logado) { setLoading(false); return; }
		carregarCarrinho();
	}, [logado]);

	async function carregarCarrinho() {
		try {
			const data = await getCarrinho();
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao carregar carrinho:", error);
		} finally {
			setLoading(false);
		}
	}

	// ── helpers locais (sem login) ────────────────────────
	function calcTotais(itens) {
		return {
			total:    itens.reduce((s, i) => s + Number(i.preco) * i.qtd, 0),
			qtdTotal: itens.reduce((s, i) => s + i.qtd, 0),
		};
	}

	function setItensLocal(fn) {
		setCarrinho(prev => {
			const novosItens = fn(prev.itens);
			return { ...prev, itens: novosItens, ...calcTotais(novosItens) };
		});
	}

	// ── adicionar ─────────────────────────────────────────
	async function adicionar(produto, quantidade = 1) {
		// produto pode vir como objeto completo ou só o id
		const idProduto = typeof produto === "object" ? produto.id : produto;

		if (!logado) {
			// modo local — guarda o objeto completo para ter precoOld, desconto etc.
			setItensLocal(prev => {
				const existe = prev.find(i => i.idProduto === idProduto);
				if (existe) {
					return prev.map(i =>
						i.idProduto === idProduto ? { ...i, qtd: i.qtd + quantidade } : i
					);
				}
				const p = typeof produto === "object" ? produto : { id: idProduto };
				return [...prev, {
					id:        Date.now(),
					idProduto,
					nome:      p.nome      ?? "",
					imagem:    p.imagem    ?? null,
					preco:     Number(p.preco ?? 0),
					precoOld:  p.precoOld  ?? null,
					desconto:  p.desconto  ?? 0,
					categoria: p.categoria ?? "",
					qtd:       quantidade,
				}];
			});
			return;
		}

		try {
			const data = await addItem(idProduto, quantidade);
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao adicionar item:", error);
			throw error;
		}
	}

	// ── alterar quantidade ────────────────────────────────
	async function alterarQtd(idProduto, quantidade) {
		if (!logado) {
			if (quantidade <= 0) {
				setItensLocal(prev => prev.filter(i => i.idProduto !== idProduto));
			} else {
				setItensLocal(prev =>
					prev.map(i => i.idProduto === idProduto ? { ...i, qtd: quantidade } : i)
				);
			}
			return;
		}
		try {
			const data = await updateItem(idProduto, quantidade);
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao alterar quantidade:", error);
			throw error;
		}
	}

	// ── remover ───────────────────────────────────────────
	async function remover(idProduto) {
		if (!logado) {
			setItensLocal(prev => prev.filter(i => i.idProduto !== idProduto));
			return;
		}
		try {
			const data = await removeItem(idProduto);
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao remover item:", error);
			throw error;
		}
	}

	// ── limpar ────────────────────────────────────────────
	async function limpar() {
		if (!logado) {
			setCarrinho(prev => ({ ...prev, itens: [], total: 0, qtdTotal: 0 }));
			return;
		}
		try {
			await clearCarrinho();
			await carregarCarrinho();
		} catch (error) {
			console.error("Erro ao limpar carrinho:", error);
			throw error;
		}
	}

	return (
		<CarrinhoContext.Provider
			value={{
				loading,
				id:       carrinho.id,
				status:   carrinho.status,
				itens:    carrinho.itens,
				total:    carrinho.total,
				qtdTotal: carrinho.qtdTotal,
				carregarCarrinho,
				adicionar,
				alterarQtd,
				remover,
				limpar,
			}}
		>
			{children}
		</CarrinhoContext.Provider>
	);
}

export function useCarrinho() {
	const context = useContext(CarrinhoContext);
	if (!context) {
		throw new Error("useCarrinho deve ser utilizado dentro de um CarrinhoProvider");
	}
	return context;
}
