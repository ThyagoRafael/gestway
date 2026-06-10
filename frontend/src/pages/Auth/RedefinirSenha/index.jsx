import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormSection from "../../../components/FormSection";

import styles from "./RedefinirSenha.module.css";

export default function RedefinirSenha() {
	const [formData, setFormData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const navigate = useNavigate();

	const handleChange = (nameInput, value) => {
		setFormData((prev) => ({ ...prev, [nameInput]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/entrar");
	};

	return (
		<>
			<BrandingSection />

			<FormSection
				title="Esqueceu sua senha?"
				footer={null}
				handleSubmit={handleSubmit}
			>
				<div className={styles.successBox}>
					<p>E-mail confirmado com sucesso.</p>
					<p>Agora, crie sua nova senha</p>
				</div>

				<div className={styles.inputGroup}>
					<FormInput
						icon={<FaLock size={16} />}
						type="password"
						name="newPassword"
						required={true}
						autoComplete="new-password"
						label="Nova Senha"
						value={formData.newPassword}
						handleChange={handleChange}
					/>
					<ul className={styles.requirements}>
						<li>De 8 a 32 caracteres;</li>
						<li>Letras maiúsculas e minúsculas;</li>
						<li>No mínimo 1 número e 1 caractere especial (ex: ! @#$)</li>
					</ul>
				</div>

				<FormInput
					icon={<FaCheck size={16} />}
					type="password"
					name="confirmPassword"
					required={true}
					autoComplete="new-password"
					label="Confirmar Senha"
					value={formData.confirmPassword}
					handleChange={handleChange}
				/>

				<FormButton>Salvar nova senha</FormButton>
			</FormSection>
		</>
	);
}
