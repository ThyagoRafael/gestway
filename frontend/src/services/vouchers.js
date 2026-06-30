import { apiFetch } from "./api";

// Backend retorna: id_voucher, codigo_voucher, porcentagem_desconto_voucher,
//                  data_inicio_voucher, data_validade_voucher, descricao_voucher

function calcStatus(inicio, validade) {
	const agora = new Date();
	const ini   = new Date(inicio);
	const val   = new Date(validade);
	if (agora > val) return "Expirado";
	if (agora < ini) return "Inativo";
	return "Ativo";
}

function formatarData(iso) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("pt-BR");
}

function mapVoucher(v) {
	return {
		id:        v.id_voucher,
		code:    v.codigo_voucher,
		discount:  `${v.porcentagem_desconto_voucher}%`,
		discount_raw: Number(v.porcentagem_desconto_voucher),
		status:    calcStatus(v.data_inicio_voucher, v.data_validade_voucher),
		criadoEm: formatarData(v.data_inicio_voucher),
		validade:  formatarData(v.data_validade_voucher),
		// datas ISO para enviar no PATCH
		initialDate:    v.data_inicio_voucher,
		expirationDate: v.data_validade_voucher,
		description:  v.descricao_voucher ?? "",
	};
}

/** GET /api/vouchers */
export async function getVouchers() {
	const data = await apiFetch("/vouchers");
	return data.map(mapVoucher);
}

/**
 * POST /api/vouchers
 * { code, discount, initialDate, expirationDate, description }
 * initialDate / expirationDate: string ISO "YYYY-MM-DD"
 */
export async function createVoucher({ code, discount, initialDate, expirationDate, description }) {
	const data = await apiFetch("/vouchers", {
		method: "POST",
		body: JSON.stringify({ code, discount, initialDate, expirationDate, description }),
	});
	return mapVoucher(data);
}

/** PATCH /api/vouchers/:id — todos os campos opcionais */
export async function updateVoucher(id, fields) {
	const data = await apiFetch(`/vouchers/${id}`, {
		method: "PATCH",
		body: JSON.stringify(fields),
	});
	return mapVoucher(data);
}
