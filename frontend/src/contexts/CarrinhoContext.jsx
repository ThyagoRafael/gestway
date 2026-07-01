import { createContext, useContext, useEffect, useState } from "react";
import {
	getCarrinho,
	addItem,
	updateItem,
	removeItem,
	clearCarrinho,
} from "../services/carrinho";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
	const [carrinho, setCarrinho] = useState({
		id: null,
		status: "ABERTO",
		itens: [],
		total: 0,
		qtdTotal: 0,
	});

	const [loading, setLoading] = useState(true);

	// Carrega o carrinho ao iniciar a aplicação
	useEffect(() => {
		carregarCarrinho();
	}, []);

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

	async function adicionar(idProduto, quantidade = 1) {
		try {
			const data = await addItem(idProduto, quantidade);
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao adicionar item:", error);
			throw error;
		}
	}

	async function alterarQtd(idProduto, quantidade) {
		try {
			const data = await updateItem(idProduto, quantidade);
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao alterar quantidade:", error);
			throw error;
		}
	}

	async function remover(idProduto) {
		try {
			const data = await removeItem(idProduto);
			setCarrinho(data);
		} catch (error) {
			console.error("Erro ao remover item:", error);
			throw error;
		}
	}

	async function limpar() {
		try {
			await clearCarrinho();

			// Busca um novo carrinho vazio
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

				id: carrinho.id,
				status: carrinho.status,
				itens: carrinho.itens,
				total: carrinho.total,
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