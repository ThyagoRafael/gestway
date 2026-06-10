import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormSection from "../../../components/FormSection";

import styles from "./EsqueceuSenha.module.css";

export default function EsqueceuSenha() {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		email: "",
		newPassword: "",
		confirmPassword: "",
	});
	const navigate = useNavigate();

	const handleChange = (nameInput, value) => {
		setFormData((prev) => ({ ...prev, [nameInput]: value }));
	};

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		setStep(2);
	};

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
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
					<p className={styles.description}>
						Digite seu email para resetar sua senha.
					</p>

					<FormInput
						icon={<MdEmail size={16} />}
						type="email"
						name="email"
						required={true}
						autoComplete="email"
						label="E-mail"
						value={formData.email}
						handleChange={handleChange}
					/>

					<FormButton>Confirmar Email</FormButton>
				</FormSection>
			</>
		);
	}

	return (
		<>
			<BrandingSection />

			<FormSection
				title="Esqueceu sua senha?"
				footer={null}
				handleSubmit={handlePasswordSubmit}
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
