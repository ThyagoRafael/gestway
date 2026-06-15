import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaLock, FaPhoneAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormOptions from "../../../components/FormOptions";
import FormSection from "../../../components/FormSection";
import styles from "./Register.module.css";

export default function Cadastrar() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	});
	const navigate = useNavigate();

	const handleChange = (inputName, value) => {
		setFormData((prev) => ({ ...prev, [inputName]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:3000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message);
			}

			const data = await response.json();

			localStorage.setItem("userEmail", data.email);
			alert("Conta criada com sucesso");
			navigate("/entrar");
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<>
			<BrandingSection />

			<FormSection
				title={"Crie a sua conta"}
				handleSubmit={handleSubmit}
			>
				<FormInput
					icon={<FaUser size={16} />}
					type={"text"}
					name={"fullName"}
					required={true}
					autoComplete={"name"}
					label={"Nome*"}
					value={formData.fullName}
					handleChange={handleChange}
				/>

				<FormInput
					icon={<MdEmail size={16} />}
					type={"email"}
					name={"email"}
					required={true}
					autoComplete={"email"}
					label={"Email*"}
					value={formData.email}
					handleChange={handleChange}
				/>

				<FormInput
					icon={<FaPhoneAlt size={16} />}
					type={"tel"}
					name={"phoneNumber"}
					required={true}
					autoComplete={"tel"}
					label={"Telefone*"}
					value={formData.phoneNumber}
					handleChange={handleChange}
				/>

				<div className={styles["input-conditions"]}>
					<FormInput
						icon={<FaLock size={16} />}
						type={"password"}
						name={"password"}
						required={true}
						autoComplete={"new-password"}
						label={"Nova Senha*"}
						value={formData.password}
						handleChange={handleChange}
					/>

					<ul>
						<li>De 8 a 32 caracteres.</li>
						<li>Letras maiúsculas e minúsculas.</li>
						<li>No mínimo 1 número e 1 caractere especial (ex: !@#$).</li>
					</ul>
				</div>

				<FormInput
					icon={<FaCheck size={16} />}
					type={"password"}
					name={"confirmPassword"}
					required={true}
					autoComplete={"current-password"}
					label={"Confirmar Senha*"}
					value={formData.confirmPassword}
					handleChange={handleChange}
				/>

				<FormOptions>
					<label htmlFor="remember">
						<input
							type="checkbox"
							id="remember"
							name="remember"
						/>
						Aceitar os <a href="#">Termos de condição</a> e <a href="#">Políticas de privacidade</a>.
					</label>
				</FormOptions>

				<FormButton>Cadastrar</FormButton>
			</FormSection>
		</>
	);
}
