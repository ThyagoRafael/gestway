// ── Regras de validação compartilhadas entre Cadastrar / Redefinir Senha ────

export const RULES = {
	nome: {
		min: 3,
		max: 80,
	},
	email: {
		max: 254,
	},
	telefone: {
		max: 15, // (99) 99999-9999
	},
	senha: {
		min: 8,
		max: 32,
	},
};

// Formata telefone: remove tudo que não é número e aplica máscara BR
export function formatarTelefone(valor) {
	const nums = valor.replace(/\D/g, "").slice(0, 11);
	if (nums.length <= 2)  return nums.length ? `(${nums}` : "";
	if (nums.length <= 6)  return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
	if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
	return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

// Valida senha conforme regras de negócio
export function validarSenha(senha) {
	if (senha.length < RULES.senha.min) return `Mínimo de ${RULES.senha.min} caracteres.`;
	if (senha.length > RULES.senha.max) return `Máximo de ${RULES.senha.max} caracteres.`;
	if (!/[A-Z]/.test(senha))           return "Deve conter ao menos uma letra maiúscula.";
	if (!/[a-z]/.test(senha))           return "Deve conter ao menos uma letra minúscula.";
	if (!/[0-9]/.test(senha))           return "Deve conter ao menos um número.";
	if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha))
		return "Deve conter ao menos um caractere especial (ex: !@#$).";
	return null;
}

// Valida e-mail simples
export function validarEmail(email) {
	if (!email) return "E-mail obrigatório.";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido.";
	return null;
}

// Valida nome completo
export function validarNome(nome) {
	if (!nome || nome.trim().length < RULES.nome.min)
		return `Nome deve ter ao menos ${RULES.nome.min} caracteres.`;
	if (!nome.trim().includes(" ")) return "Informe o nome completo.";
	return null;
}

// Valida telefone (só números, mínimo 10 dígitos)
export function validarTelefone(tel) {
	const nums = tel.replace(/\D/g, "");
	if (nums.length < 10) return "Telefone inválido. Ex: (99) 99999-9999";
	return null;
}
