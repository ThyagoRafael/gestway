import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormSection     from "../../../components/FormSection";

import { RULES, validarEmail, validarSenha } from "../../../utils/useAuthValidation";
import { forgotPassword } from "../../../services/auth";
import styles from "./EsqueceuSenha.module.css";

export default function EsqueceuSenha() {
	const [step,     setStep]     = useState(1);
	const [formData, setFormData] = useState({ email: "", newPassword: "", confirmPassword: "" });
	const [errors,   setErrors]   = useState({});
	const [touched,  setTouched]  = useState({});
	const [loading,  setLoading]  = useState(false);
	const [apiError, setApiError] = useState(null);

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		setApiError(null);
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
	};

	const handleBlur = (name) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const errs = validateStep(step, formData);
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
			if (!data.confirmPassword)
				e.confirmPassword = "Confirme sua senha.";
			else if (data.confirmPassword !== data.newPassword)
				e.confirmPassword = "As senhas não coincidem.";
		}
		return e;
	};

	// ── step 1: envia e-mail real para o backend ──────────
	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		const errs = validateStep(1, formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ email: true });
			return;
		}

		setLoading(true);
		setApiError(null);
		try {
			await forgotPassword({ email: formData.email });
			// backend envia o e-mail com o link; avançamos para a tela de confirmação
			setStep(2);
		} catch (err) {
			setApiError(err.message);
		} finally {
			setLoading(false);
		}
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
					{apiError && <p className={styles.apiError}>{apiError}</p>}

					<p className={styles.description}>
						Digite seu e-mail e enviaremos um link para redefinir sua senha.
					</p>

					<FormInput
						icon={<MdEmail size={16} />}
						type="email" name="email" required autoComplete="email" label="E-mail"
						value={formData.email} handleChange={handleChange}
						maxLength={RULES.email.max}
						error={touched.email ? errors.email : null}
						onBlur={() => handleBlur("email")}
					/>

					<FormButton disabled={loading}>
						{loading ? "Enviando..." : "Confirmar E-mail"}
					</FormButton>
				</FormSection>
			</>
		);
	}

	// step 2 — apenas confirmação visual; a redefinição real acontece em /redefinir-senha
	return (
		<>
			<BrandingSection />
			<FormSection title="Verifique seu e-mail" footer={<Link to="/entrar">Voltar para o login</Link>} handleSubmit={(e) => e.preventDefault()}>
				<div className={styles.successBox}>
					<p>E-mail enviado para <strong>{formData.email}</strong>.</p>
					<p>Clique no link que você recebeu para criar uma nova senha.</p>
					<p style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "#888" }}>
						O link expira em 10 minutos.
					</p>
				</div>
			</FormSection>
		</>
	);
}
