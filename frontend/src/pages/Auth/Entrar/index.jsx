import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormOptions     from "../../../components/FormOptions";
import FormSection     from "../../../components/FormSection";

import { RULES, validarEmail } from "../../../utils/useAuthValidation";

export default function Entrar() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors,   setErrors]   = useState({});
	const [touched,  setTouched]  = useState({});
	const navigate = useNavigate();

	// ── onChange ────────────────────────────────────────
	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		// limpa erro ao corrigir
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
	};

	// ── onBlur: valida campo ao sair ─────────────────────
	const handleBlur = (name) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const errs = validate({ ...formData });
		setErrors((prev) => ({ ...prev, [name]: errs[name] ?? null }));
	};

	// ── validação ────────────────────────────────────────
	const validate = (data) => {
		const e = {};
		const emailErr = validarEmail(data.email);
		if (emailErr) e.email = emailErr;
		if (!data.password)                        e.password = "Senha obrigatória.";
		else if (data.password.length < RULES.senha.min) e.password = `Mínimo ${RULES.senha.min} caracteres.`;
		return e;
	};

	// ── submit ────────────────────────────────────────────
	const handleSubmit = (e) => {
		e.preventDefault();
		const errs = validate(formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ email: true, password: true });
			return;
		}
		navigate("/dashboard");
	};

	return (
		<>
			<BrandingSection />

			<FormSection
				title="Acesse sua plataforma"
				footer={
					<>
						<Link to="/cadastrar">Não tem conta? Cadastre-se agora</Link>
						<Link to="/esqueceu-senha">Esqueceu sua senha? Clique aqui</Link>
					</>
				}
				handleSubmit={handleSubmit}
			>
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

				<FormInput
					icon={<FaLock size={16} />}
					type="password"
					name="password"
					required
					autoComplete="current-password"
					label="Senha*"
					value={formData.password}
					handleChange={handleChange}
					maxLength={RULES.senha.max}
					error={touched.password ? errors.password : null}
					onBlur={() => handleBlur("password")}
				/>

				<FormOptions>
					<label htmlFor="remember">
						<input type="checkbox" id="remember" name="remember" />
						Manter conectado
					</label>
				</FormOptions>

				<FormButton>Entrar</FormButton>
			</FormSection>
		</>
	);
}
