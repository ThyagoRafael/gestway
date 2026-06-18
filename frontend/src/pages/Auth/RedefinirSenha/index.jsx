import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormSection     from "../../../components/FormSection";

import { RULES, validarSenha } from "../../../utils/useAuthValidation";
import styles from "./RedefinirSenha.module.css";

export default function RedefinirSenha() {
	const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
	const [errors,   setErrors]   = useState({});
	const [touched,  setTouched]  = useState({});
	const navigate = useNavigate();

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
	};

	const handleBlur = (name) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
		const errs = validate(formData);
		setErrors((prev) => ({ ...prev, [name]: errs[name] ?? null }));
	};

	const validate = (data) => {
		const e = {};
		const senhaErr = validarSenha(data.newPassword);
		if (senhaErr) e.newPassword = senhaErr;
		if (!data.confirmPassword)                       e.confirmPassword = "Confirme sua senha.";
		else if (data.confirmPassword !== data.newPassword) e.confirmPassword = "As senhas não coincidem.";
		return e;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errs = validate(formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ newPassword: true, confirmPassword: true });
			return;
		}
		navigate("/entrar");
	};

	return (
		<>
			<BrandingSection />
			<FormSection title="Redefinir senha" footer={null} handleSubmit={handleSubmit}>
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
