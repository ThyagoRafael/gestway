import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormSection from "../../../components/FormSection";

import styles from "./RedefinirSenha.module.css";

export default function RedefinirSenha() {
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [success, setSuccess] = useState(false);
	const [searchparams] = useSearchParams();
	const token = searchparams.get("token");
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate("/entrar");
		}
	}, [token, navigate]);

	const handleChange = (nameInput, value) => {
		setFormData((prev) => ({ ...prev, [nameInput]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setSuccess(true);

			const response = await fetch("http://localhost:3000/api/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					token,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message);
			}

			const data = await response.json();
			alert(data.message);
			navigate("/entrar");
		} catch (error) {
			setSuccess(false);
			alert(error.message);

			if (error.response.status === 401) {
				navigate("/esqueceu-senha");
			}
		}
	};

	return (
		<>
			<BrandingSection />

			<FormSection
				title="Redefina sua senha"
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
						name="password"
						required={true}
						autoComplete="new-password"
						label="Nova Senha*"
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
					label="Confirmar Senha*"
					value={formData.confirmPassword}
					handleChange={handleChange}
				/>

				<FormButton disabled={success}>Salvar nova senha</FormButton>
			</FormSection>
		</>
	);
}
