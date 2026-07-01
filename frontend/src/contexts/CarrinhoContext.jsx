import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { estaLogado } from "../services/auth";
import * as carrinhoService from "../services/carrinho";

// ── mock para visualização sem login ────────────────────────────────────────
// Remova MOCK_ITENS e o estado inicial quando não precisar mais
const MOCK_ITENS = [
	{ id: 1, idProduto: 1, nome: "Camisa Corinthians",    preco: 189.99,    qtd: 2, imagem: null },
	{ id: 2, idProduto: 2, nome: "Plano GestWay",         preco: 2000.00,   qtd: 1, imagem: null },
	{ id: 3, idProduto: 3, nome: "Taça Mundial Palmeiras", preco: 1234500.0, qtd: 1, imagem: null },
];

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
	const logado = estaLogado();

	// estado local (mock quando não logado, ou cache quando logado)
	const [itens,    setItens]    = useState(logado ? [] : MOCK_ITENS);
	const [loading,  setLoading]  = useState(false);
	const [erro,     setErro]     = useState(null);

	// ── carrega do backend quando logado ────────────────────────────────────
	const sincronizar = useCallback(async () => {
		if (!logado) return;
		setLoading(true);
		try {
			const data = await carrinhoService.getCarrinho();
			setItens(data.itens);
		} catch (e) {
			setErro(e.message);
		} finally {
			setLoading(false);
		}
	}, [logado]);

	useEffect(() => { sincronizar(); }, [sincronizar]);

	// ── adicionar ────────────────────────────────────────────────────────────
	const adicionar = async (produto, quantidade = 1) => {
		if (!logado) {
			// modo local (sem login)
			setItens(prev => {
				const existe = prev.find(i => i.idProduto === produto.id);
				if (existe) return prev.map(i => i.idProduto === produto.id ? { ...i, qtd: i.qtd + quantidade } : i);
				return [...prev, { id: Date.now(), idProduto: produto.id, nome: produto.nome, preco: produto.preco, imagem: produto.imagem ?? null, qtd: quantidade }];
			});
			return;
		}
		try {
			const data = await carrinhoService.addItem(produto.id, quantidade);
			setItens(data.itens);
		} catch (e) {
			setErro(e.message);
		}
	};

	// ── remover ──────────────────────────────────────────────────────────────
	const remover = async (idProduto) => {
		if (!logado) {
			setItens(prev => prev.filter(i => i.idProduto !== idProduto));
			return;
		}
		try {
			const data = await carrinhoService.removeItem(idProduto);
			setItens(data.itens);
		} catch (e) {
			setErro(e.message);
		}
	};

	// ── alterar quantidade ───────────────────────────────────────────────────
	const alterarQtd = async (idProduto, qtd) => {
		if (!logado) {
			if (qtd <= 0) { remover(idProduto); return; }
			setItens(prev => prev.map(i => i.idProduto === idProduto ? { ...i, qtd } : i));
			return;
		}
		try {
			const data = await carrinhoService.updateItem(idProduto, qtd);
			setItens(data.itens);
		} catch (e) {
			setErro(e.message);
		}
	};

	// ── limpar ───────────────────────────────────────────────────────────────
	const limpar = async () => {
		if (!logado) { setItens([]); return; }
		try {
			await carrinhoService.clearCarrinho();
			setItens([]);
		} catch (e) {
			setErro(e.message);
		}
	};

	const total    = itens.reduce((sum, i) => sum + Number(i.preco) * i.qtd, 0);
	const qtdTotal = itens.reduce((sum, i) => sum + i.qtd, 0);

	return (
		<CarrinhoContext.Provider value={{
			itens, adicionar, remover, alterarQtd, limpar,
			total, qtdTotal, loading, erro, sincronizar,
		}}>
			{children}
		</CarrinhoContext.Provider>
	);
}

export function useCarrinho() {
	return useContext(CarrinhoContext);
}
