import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormSection     from "../../../components/FormSection";

import { RULES, validarEmail, validarSenha } from "../../../utils/useAuthValidation";
import styles from "./EsqueceuSenha.module.css";

export default function EsqueceuSenha() {
	const [step,     setStep]     = useState(1);
	const [formData, setFormData] = useState({ email: "", newPassword: "", confirmPassword: "" });
	const [errors,   setErrors]   = useState({});
	const [touched,  setTouched]  = useState({});
	const navigate = useNavigate();

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
	};

	const handleBlur = (name, data = formData) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const errs = validateStep(step, data);
		setErrors((prev) => ({ ...prev, [name]: errs[name] ?? null }));
	};

	const validateStep = (s, data) => {
		const e = {};
		if (s === 1) {
			const emailErr = validarEmail(data.email);
			if (emailErr) e.email = emailErr;
		} else {
			const senhaErr = validarSenha(data.newPassword);
			if (senhaErr) e.newPassword = senhaErr;
			if (!data.confirmPassword)              e.confirmPassword = "Confirme sua senha.";
			else if (data.confirmPassword !== data.newPassword) e.confirmPassword = "As senhas não coincidem.";
		}
		return e;
	};

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		const errs = validateStep(1, formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ email: true });
			return;
		}
		setStep(2);
	};

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		const errs = validateStep(2, formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ newPassword: true, confirmPassword: true });
			return;
		}
		navigate("/entrar");
	};

	if (step === 1) {
		return (
			<>
				<BrandingSection />
				<FormSection
					title="Esqueceu sua senha?"
					footer={
						<>
							<Link to="/entrar">Volte para o Login</Link>
							<Link to="/cadastrar">Não tem conta? Cadastre-se agora.</Link>
						</>
					}
					handleSubmit={handleEmailSubmit}
				>
					<p className={styles.description}>Digite seu email para resetar sua senha.</p>

					<FormInput
						icon={<MdEmail size={16} />}
						type="email"
						name="email"
						required
						autoComplete="email"
						label="E-mail"
						value={formData.email}
						handleChange={handleChange}
						maxLength={RULES.email.max}
						error={touched.email ? errors.email : null}
						onBlur={() => handleBlur("email")}
					/>

					<FormButton>Confirmar Email</FormButton>
				</FormSection>
			</>
		);
	}

	return (
		<>
			<BrandingSection />
			<FormSection title="Esqueceu sua senha?" footer={null} handleSubmit={handlePasswordSubmit}>
				<div className={styles.successBox}>
					<p>E-mail confirmado com sucesso.</p>
					<p>Agora, crie sua nova senha</p>
				</div>

				<div className={styles.inputGroup}>
					<FormInput
						icon={<FaLock size={16} />}
						type="password"
						name="newPassword"
						required
						autoComplete="new-password"
						label="Nova Senha"
						value={formData.newPassword}
						handleChange={handleChange}
						maxLength={RULES.senha.max}
						error={touched.newPassword ? errors.newPassword : null}
						onBlur={() => handleBlur("newPassword")}
					/>
					<ul className={styles.requirements}>
						<li>De 8 a 32 caracteres;</li>
						<li>Letras maiúsculas e minúsculas;</li>
						<li>No mínimo 1 número e 1 caractere especial (ex: !@#$)</li>
					</ul>
				</div>

				<FormInput
					icon={<FaCheck size={16} />}
					type="password"
					name="confirmPassword"
					required
					autoComplete="new-password"
					label="Confirmar Senha"
					value={formData.confirmPassword}
					handleChange={handleChange}
					maxLength={RULES.senha.max}
					error={touched.confirmPassword ? errors.confirmPassword : null}
					onBlur={() => handleBlur("confirmPassword")}
				/>

				<FormButton>Salvar nova senha</FormButton>
			</FormSection>
		</>
	);
}
