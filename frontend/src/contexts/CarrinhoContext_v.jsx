import { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
	const [itens, setItens] = useState([]);

	const adicionar = (produto) => {
		setItens(prev => {
			const existe = prev.find(i => i.id === produto.id);
			if (existe) {
				return prev.map(i => i.id === produto.id
					? { ...i, qtd: i.qtd + 1 }
					: i
				);
			}
			return [...prev, { ...produto, qtd: 1 }];
		});
	};

	const remover = (id) =>
		setItens(prev => prev.filter(i => i.id !== id));

	const alterarQtd = (id, qtd) => {
		if (qtd <= 0) { remover(id); return; }
		setItens(prev => prev.map(i => i.id === id ? { ...i, qtd } : i));
	};

	const limpar = () => setItens([]);

	const total = itens.reduce((sum, i) => sum + Number(i.preco) * i.qtd, 0);
	const qtdTotal = itens.reduce((sum, i) => sum + i.qtd, 0);

	return (
		<CarrinhoContext.Provider value={{ itens, adicionar, remover, alterarQtd, limpar, total, qtdTotal }}>
			{children}
		</CarrinhoContext.Provider>
	);
}

export function useCarrinho() {
	return useContext(CarrinhoContext);
}