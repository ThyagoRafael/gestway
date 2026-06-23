import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck, FaLock, FaPhoneAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormOptions     from "../../../components/FormOptions";
import FormSection     from "../../../components/FormSection";

import {
	RULES,
	validarEmail,
	validarNome,
	validarSenha,
	validarTelefone,
	formatarTelefone,
} from "../../../utils/useAuthValidation";

import { register } from "../../../services/auth";

import styles from "./Register.module.css";

const CRITERIOS = [
	{ id: "len",     label: "De 8 a 32 caracteres.",                                 test: (s) => s.length >= 8 && s.length <= 32 },
	{ id: "cases",   label: "Letras maiúsculas e minúsculas.",                       test: (s) => /[A-Z]/.test(s) && /[a-z]/.test(s) },
	{ id: "numspec", label: "No mínimo 1 número e 1 caractere especial (ex: !@#$).", test: (s) => /[0-9]/.test(s) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(s) },
];

const CAMPOS = ["name", "email", "phone", "password", "confirmPassword", "termos"];

export default function Cadastrar() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "", email: "", phone: "", password: "", confirmPassword: "", termos: false,
	});
	const [touched,  setTouched]  = useState(Object.fromEntries(CAMPOS.map((c) => [c, false])));
	const [loading,  setLoading]  = useState(false);
	const [apiError, setApiError] = useState(null);

	const validate = (data) => {
		const e = {};
		const nomeErr = validarNome(data.name);
		if (nomeErr) e.name = nomeErr;

		const emailErr = validarEmail(data.email);
		if (emailErr) e.email = emailErr;

		const telErr = validarTelefone(data.phone);
		if (telErr) e.phone = telErr;

		const senhaErr = validarSenha(data.password);
		if (senhaErr) e.password = senhaErr;

		if (!data.confirmPassword)                       e.confirmPassword = "Confirme sua senha.";
		else if (data.confirmPassword !== data.password) e.confirmPassword = "As senhas não coincidem.";

		if (!data.termos) e.termos = "Você deve aceitar os termos para continuar.";

		return e;
	};

	const errors = validate(formData);

	const handleChange = (name, value) => {
		let parsed = value;
		if (name === "phone") parsed = formatarTelefone(value);
		setFormData((prev) => ({ ...prev, [name]: parsed }));
		setApiError(null);
	};

	const handleCheckbox = (e) => {
		setFormData((prev) => ({ ...prev, termos: e.target.checked }));
		setTouched((prev) => ({ ...prev, termos: true }));
	};

	const handleBlur = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setTouched(Object.fromEntries(CAMPOS.map((c) => [c, true])));
		if (Object.keys(errors).length > 0) return;

		setLoading(true);
		setApiError(null);

		try {
			// Remove máscara do telefone antes de enviar
			const phoneNumber = formData.phone.replace(/\D/g, "");

			await register({
				fullName:    formData.name,
				email:       formData.email,
				phoneNumber,
				password:    formData.password,
			});

			navigate("/entrar", { state: { cadastroSucesso: true } });
		} catch (err) {
			setApiError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const err = (name) => (touched[name] ? errors[name] : null);

	return (
		<>
			<BrandingSection />

			<FormSection
				title="Crie a sua conta"
				footer={<Link to="/entrar">Já tem conta? Faça login</Link>}
				handleSubmit={handleSubmit}
			>
				{apiError && <p className={styles.apiError}>{apiError}</p>}

				<FormInput
					icon={<FaUser size={16} />}
					type="text" name="name" required autoComplete="name" label="Nome*"
					value={formData.name} handleChange={handleChange}
					maxLength={RULES.nome.max} error={err("name")} onBlur={() => handleBlur("name")}
				/>

				<FormInput
					icon={<MdEmail size={16} />}
					type="email" name="email" required autoComplete="email" label="Email*"
					value={formData.email} handleChange={handleChange}
					maxLength={RULES.email.max} error={err("email")} onBlur={() => handleBlur("email")}
				/>

				<FormInput
					icon={<FaPhoneAlt size={16} />}
					type="tel" name="phone" required autoComplete="tel" label="Telefone*"
					value={formData.phone} handleChange={handleChange}
					maxLength={RULES.telefone.max} error={err("phone")} onBlur={() => handleBlur("phone")}
				/>

				<div className={styles["input-conditions"]}>
					<FormInput
						icon={<FaLock size={16} />}
						type="password" name="password" required autoComplete="new-password" label="Nova Senha*"
						value={formData.password} handleChange={handleChange}
						maxLength={RULES.senha.max} onBlur={() => handleBlur("password")}
					/>
					<ul className={styles.criterios}>
						{CRITERIOS.map((c) => {
							const digitando = formData.password.length > 0;
							const ok = digitando && c.test(formData.password);
							return (
								<li key={c.id} className={`${styles.criterio} ${!digitando ? "" : ok ? styles.criterioOk : styles.criterioErr}`}>
									<span className={styles.criterioIcon}>{ok ? "✓" : "•"}</span>
									{c.label}
								</li>
							);
						})}
					</ul>
				</div>

				<FormInput
					icon={<FaCheck size={16} />}
					type="password" name="confirmPassword" required autoComplete="new-password" label="Confirmar Senha*"
					value={formData.confirmPassword} handleChange={handleChange}
					maxLength={RULES.senha.max} error={err("confirmPassword")} onBlur={() => handleBlur("confirmPassword")}
				/>

				<FormOptions>
					<label htmlFor="termos" className={err("termos") ? styles.termosErr : ""}>
						<input type="checkbox" id="termos" name="termos" checked={formData.termos} onChange={handleCheckbox}/>
						Aceitar os <a href="#">Termos de condição</a> e <a href="#">Políticas de privacidade</a>.
					</label>
					{err("termos") && <p className={styles.termosErrMsg}>{err("termos")}</p>}
				</FormOptions>

				<FormButton disabled={loading}>
					{loading ? "Cadastrando..." : "Cadastrar"}
				</FormButton>
			</FormSection>
		</>
	);
}
