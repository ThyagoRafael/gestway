import { FaCheck, FaLock, FaPhoneAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import BrandingSection from "../../../components/BrandingSection";
import FormButton from "../../../components/FormButton";
import FormInput from "../../../components/FormInput";
import FormOptions from "../../../components/FormOptions";
import FormSection from "../../../components/FormSection";
import styles from "./Register.module.css";

export default function Cadastrar() {
	return (
		<>
			<BrandingSection />

			<FormSection title={"Crie a sua conta"}>
				<FormInput
					icon={<FaUser size={16} />}
					type={"text"}
					name={"name"}
					required={true}
					autoComplete={"name"}
					label={"Nome*"}
				/>

				<FormInput
					icon={<MdEmail size={16} />}
					type={"email"}
					name={"email"}
					required={true}
					autoComplete={"email"}
					label={"Email*"}
				/>

				<FormInput
					icon={<FaPhoneAlt size={16} />}
					type={"tel"}
					name={"phone"}
					required={true}
					autoComplete={"tel"}
					label={"Telefone*"}
				/>

				<div className={styles["input-conditions"]}>
					<FormInput
						icon={<FaLock size={16} />}
						type={"password"}
						name={"new-password"}
						required={true}
						autoComplete={"new-password"}
						label={"Nova Senha*"}
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
					name={"confirm-password"}
					required={true}
					autoComplete={"current-password"}
					label={"Confirmar Senha*"}
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
