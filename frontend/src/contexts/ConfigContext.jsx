import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "gestway_config";

const INICIAL = {
	corPrimaria:   "#176FB8",
	corSecundaria: "#729AFF",
	logo:          null,
	banner1: {
		titulo:    "Smartphones",
		descUpper: "As melhores ofertas de smartphones",
		desc:      "Apple, Samsung, Xiaomi e mais!",
		imagem:    null,
		desconto:  "Até 50% de desconto!",
	},
	banner2: {
		titulo:    "Camisas esportivas",
		descUpper: "Camisas de time? Também em promoção!",
		desc:      "Torça com estilo!",
		desconto:  "Até 70% de desconto!",
		imagem:    null,
	},
	grid1: { titulo: "As melhores promoções em {categoria}", categoria: "Eletrônicos", slots: [null, null, null, null] },
	grid2: { titulo: "As melhores promoções em {categoria}", categoria: "E-books",     slots: [null, null, null, null] },
	grid3: { titulo: "As melhores promoções em {categoria}", categoria: "Vestuários", slots: [null, null, null, null] },
	exibirBanner:  true,
	tituloVoucher: "Voucher de Bem-Vindo!",
	textoVoucher:  '10% OFF com o código "BEMVINDO10"',
	voucherSel:    null,
};

function carregarConfig() {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo) {
            const parsed = JSON.parse(salvo);
            return {
                ...INICIAL,
                ...parsed,
                grid3: parsed.grid3 ?? INICIAL.grid3,
            };
        }
    } catch {}
    return INICIAL;
}

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
	const [config, setConfig] = useState(carregarConfig);

	const atualizar = (patch) =>
		setConfig(prev => ({ ...prev, ...patch }));

	// salva no localStorage e mostra confirmação
	const salvar = () => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
			return true;
		} catch {
			return false;
		}
	};

	return (
		<ConfigContext.Provider value={{ config, atualizar, salvar }}>
			{children}
		</ConfigContext.Provider>
	);
}

export function useConfig() {
	return useContext(ConfigContext);
}
