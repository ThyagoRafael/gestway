const USE_MOCK = true;
const API_BASE = "http://localhost:3000/api";

const MOCK_PRODUTOS = [
	{ id: 1, nome: "Galaxy S22 Ultra",         preco: 3900.00, precoOld: 4099.00, estoque: 8,  categoria: "Eletrônicos", imagem: null },
	{ id: 2, nome: "Galaxy M13 (4GB | 64 GB)", preco: 1200.00, precoOld: 1872.00, estoque: 5,  categoria: "Eletrônicos", imagem: null },
	{ id: 3, nome: "Galaxy M33 (4GB | 64 GB)", preco: 1200.00, precoOld: 1872.00, estoque: 2,  categoria: "Eletrônicos", imagem: null },
	{ id: 4, nome: "Galaxy M53 (4GB | 64 GB)", preco: 1200.00, precoOld: 1872.00, estoque: 10, categoria: "Eletrônicos", imagem: null },
	{ id: 5, nome: "Harry Potter",              preco: 50.00,   precoOld: 100.00,  estoque: 8,  categoria: "E-books",     imagem: null },
	{ id: 6, nome: "Fundação",                  preco: 50.00,   precoOld: 100.00,  estoque: 12, categoria: "E-books",     imagem: null },
	{ id: 7, nome: "Percy Jackson",             preco: 50.00,   precoOld: 100.00,  estoque: 6,  categoria: "E-books",     imagem: null },
	{ id: 8, nome: "Camisa Corinthians",        preco: 180.00,  precoOld: 250.00,  estoque: 15, categoria: "Vestuário",   imagem: null },
	{ id: 9, nome: "Kit Copo",                  preco: 30.00,   precoOld: 50.00,   estoque: 42, categoria: "Utilidades",  imagem: null },
];

export async function getProdutos(categoria = null) {
	if (USE_MOCK) {
		const resultado = categoria
			? MOCK_PRODUTOS.filter(p => p.categoria === categoria)
			: MOCK_PRODUTOS;
		return Promise.resolve(resultado);
	}
	const url = categoria
		? `${API_BASE}/produtos?categoria=${encodeURIComponent(categoria)}`
		: `${API_BASE}/produtos`;
	const res = await fetch(url);
	if (!res.ok) throw new Error("Erro ao buscar produtos");
	return res.json();
}

export async function getProdutoPorId(id) {
	if (USE_MOCK) return Promise.resolve(MOCK_PRODUTOS.find(p => p.id === id) ?? null);
	const res = await fetch(`${API_BASE}/produtos/${id}`);
	if (!res.ok) throw new Error("Produto não encontrado");
	return res.json();
}
