import { useState } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormSection from "../../../components/FormSection";

import styles from "./EsqueceuSenha.module.css";

export default function EsqueceuSenha() {
	const [formData, setFormData] = useState({
		email: "",
	});
	const [success, setSuccess] = useState(false);

	const handleChange = (nameInput, value) => {
		setFormData((prev) => ({ ...prev, [nameInput]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.log(errorData);

				throw new Error(errorData.message);
			}

			const data = await response.json();
			alert(data.message);
			setSuccess(true);
		} catch (error) {
			alert(error.message);
		}
	};

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
				handleSubmit={handleSubmit}
			>
				<p className={styles.description}>Digite seu email para resetar sua senha.</p>

				<FormInput
					icon={<MdEmail size={16} />}
					type="email"
					name="email"
					required={true}
					autoComplete="email"
					label="Email*"
					value={formData.email}
					handleChange={handleChange}
				/>

				<FormButton disabled={success}>Confirmar Email</FormButton>
			</FormSection>
		</>
	);
}
