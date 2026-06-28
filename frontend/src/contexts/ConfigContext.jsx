import { createContext, useContext, useState } from "react";

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
	exibirBanner:  true,
	tituloVoucher: "Voucher de Bem-Vindo!",
	textoVoucher:  '10% OFF com o código "BEMVINDO10"',
	voucherSel:    null,
};

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
	const [config, setConfig] = useState(INICIAL);
	const atualizar = (patch) => setConfig(prev => ({ ...prev, ...patch }));
	return (
		<ConfigContext.Provider value={{ config, atualizar }}>
			{children}
		</ConfigContext.Provider>
	);
}

export function useConfig() {
	return useContext(ConfigContext);
}
