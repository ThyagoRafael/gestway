import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormOptions from "../../../components/FormOptions";
import FormSection from "../../../components/FormSection";

import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

export default function Entrar() {
	const [formData, setFormData] = useState(() => ({
		email: localStorage.getItem("userEmail") || "",
		password: "",
	}));
	const navigate = useNavigate();

	const handleChange = (nameInput, value) => {
		setFormData((prev) => ({ ...prev, [nameInput]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:3000/api/auth/login", {
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

			localStorage.setItem("user", data.user);
			localStorage.setItem("token", data.token);
			navigate("/dashboard");
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<>
			<BrandingSection />

			<FormSection
				title={"Acesse sua plataforma"}
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
					type={"email"}
					name={"email"}
					required={true}
					autoComplete={"email"}
					label={"Email*"}
					value={formData["email"]}
					handleChange={handleChange}
				/>

				<FormInput
					icon={<FaLock size={16} />}
					type={"password"}
					name={"password"}
					required={true}
					autoComplete={"password"}
					label={"Senha*"}
					value={formData["password"]}
					handleChange={handleChange}
				/>

				<FormOptions>
					<label htmlFor="remember">
						<input
							type="checkbox"
							id="remember"
							name="remember"
						/>
						Manter conectado
					</label>
				</FormOptions>

				<FormButton>Entrar</FormButton>
			</FormSection>
		</>
	);
}
