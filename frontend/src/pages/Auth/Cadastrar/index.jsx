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
	formatarTelefone,
	validarEmail,
	validarNome,
	validarSenha,
	validarTelefone,
} from "../../../utils/useAuthValidation";

import styles from "./Register.module.css";

// ── critérios de senha para checklist visual ────────────
const CRITERIOS = [
	{ id: "len",     label: "De 8 a 32 caracteres.",                                 test: (s) => s.length >= 8 && s.length <= 32 },
	{ id: "cases",   label: "Letras maiúsculas e minúsculas.",                       test: (s) => /[A-Z]/.test(s) && /[a-z]/.test(s) },
	{ id: "numspec", label: "No mínimo 1 número e 1 caractere especial (ex: !@#$).", test: (s) => /[0-9]/.test(s) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(s) },
];

export default function Cadastrar() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name:            "",
		email:           "",
		phone:           "",
		password:        "",
		confirmPassword: "",
		termos:          false,
	});
	const [errors,  setErrors]  = useState({});
	const [touched, setTouched] = useState({});

	// ── onChange ─────────────────────────────────────────
	const handleChange = (name, value) => {
		let parsed = value;
		if (name === "phone") parsed = formatarTelefone(value);
		setFormData((prev) => ({ ...prev, [name]: parsed }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
	};

	const handleCheckbox = (e) => {
		setFormData((prev) => ({ ...prev, termos: e.target.checked }));
		if (errors.termos) setErrors((prev) => ({ ...prev, termos: null }));
	};

	// ── onBlur ────────────────────────────────────────────
	const handleBlur = (name) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const errs = validate(formData);
		setErrors((prev) => ({ ...prev, [name]: errs[name] ?? null }));
	};

	// ── validação ─────────────────────────────────────────
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

		if (!data.confirmPassword)
			e.confirmPassword = "Confirme sua senha.";
		else if (data.confirmPassword !== data.password)
			e.confirmPassword = "As senhas não coincidem.";

		if (!data.termos) e.termos = "Você deve aceitar os termos para continuar.";

		return e;
	};

	// ── submit ────────────────────────────────────────────
	const handleSubmit = (e) => {
		e.preventDefault();
		const errs = validate(formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true, termos: true });
			return;
		}
		navigate("/dashboard");
	};

	return (
		<>
			<BrandingSection />

			<FormSection
				title="Crie a sua conta"
				footer={
					<Link to="/entrar">Já tem conta? Faça login</Link>
				}
				handleSubmit={handleSubmit}
			>
				{/* Nome */}
				<FormInput
					icon={<FaUser size={16} />}
					type="text"
					name="name"
					required
					autoComplete="name"
					label="Nome*"
					value={formData.name}
					handleChange={handleChange}
					maxLength={RULES.nome.max}
					error={touched.name ? errors.name : null}
					onBlur={() => handleBlur("name")}
				/>

				{/* Email */}
				<FormInput
					icon={<MdEmail size={16} />}
					type="email"
					name="email"
					required
					autoComplete="email"
					label="Email*"
					value={formData.email}
					handleChange={handleChange}
					maxLength={RULES.email.max}
					error={touched.email ? errors.email : null}
					onBlur={() => handleBlur("email")}
				/>

				{/* Telefone */}
				<FormInput
					icon={<FaPhoneAlt size={16} />}
					type="tel"
					name="phone"
					required
					autoComplete="tel"
					label="Telefone*"
					value={formData.phone}
					handleChange={handleChange}
					maxLength={RULES.telefone.max}
					error={touched.phone ? errors.phone : null}
					hint="Formato: (99) 99999-9999"
					onBlur={() => handleBlur("phone")}
				/>

				{/* Senha + checklist visual */}
				<div className={styles["input-conditions"]}>
					<FormInput
						icon={<FaLock size={16} />}
						type="password"
						name="password"
						required
						autoComplete="new-password"
						label="Nova Senha*"
						value={formData.password}
						handleChange={handleChange}
						maxLength={RULES.senha.max}
						error={touched.password ? errors.password : null}
						onBlur={() => handleBlur("password")}
					/>

					<ul className={styles.criterios}>
						{CRITERIOS.map((c) => {
							const ok = formData.password.length > 0 && c.test(formData.password);
							return (
								<li
									key={c.id}
									className={`${styles.criterio} ${
										formData.password.length === 0 ? "" : ok ? styles.criterioOk : styles.criterioErr
									}`}
								>
									<span className={styles.criterioIcon}>{ok ? "✓" : "•"}</span>
									{c.label}
								</li>
							);
						})}
					</ul>
				</div>

				{/* Confirmar senha */}
				<FormInput
					icon={<FaCheck size={16} />}
					type="password"
					name="confirmPassword"
					required
					autoComplete="new-password"
					label="Confirmar Senha*"
					value={formData.confirmPassword}
					handleChange={handleChange}
					maxLength={RULES.senha.max}
					error={touched.confirmPassword ? errors.confirmPassword : null}
					onBlur={() => handleBlur("confirmPassword")}
				/>

				{/* Termos */}
				<FormOptions>
					<label htmlFor="termos" className={errors.termos && touched.termos ? styles.termosErr : ""}>
						<input
							type="checkbox"
							id="termos"
							name="termos"
							checked={formData.termos}
							onChange={handleCheckbox}
						/>
						Aceitar os <a href="#">Termos de condição</a> e <a href="#">Políticas de privacidade</a>.
					</label>
					{errors.termos && touched.termos && (
						<p className={styles.termosErrMsg}>{errors.termos}</p>
					)}
				</FormOptions>

				<FormButton>Cadastrar</FormButton>
			</FormSection>
		</>
	);
}
