import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaLock, FaCheck } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormSection     from "../../../components/FormSection";

import { RULES, validarSenha } from "../../../utils/useAuthValidation";
import { resetPassword } from "../../../services/auth";
import styles from "./RedefinirSenha.module.css";

export default function RedefinirSenha() {
	const [searchParams]  = useSearchParams();
	const token           = searchParams.get("token");
	const navigate        = useNavigate();

	const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
	const [errors,   setErrors]   = useState({});
	const [touched,  setTouched]  = useState({});
	const [loading,  setLoading]  = useState(false);
	const [apiError, setApiError] = useState(null);

	// Se não vier token na URL, redireciona para esqueceu-senha
	useEffect(() => {
		if (!token) navigate("/esqueceu-senha", { replace: true });
	}, [token, navigate]);

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		setApiError(null);
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
		if (!data.confirmPassword)
			e.confirmPassword = "Confirme sua senha.";
		else if (data.confirmPassword !== data.newPassword)
			e.confirmPassword = "As senhas não coincidem.";
		return e;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errs = validate(formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ newPassword: true, confirmPassword: true });
			return;
		}

		setLoading(true);
		setApiError(null);
		try {
			await resetPassword({ token, password: formData.newPassword });
			navigate("/entrar", { state: { resetSucesso: true } });
		} catch (err) {
			setApiError(err.message); // ex: "Token inválido ou expirado"
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<BrandingSection />
			<FormSection
				title="Redefinir senha"
				footer={<Link to="/entrar">Voltar para o login</Link>}
				handleSubmit={handleSubmit}
			>
				{apiError && <p className={styles.apiError}>{apiError}</p>}

				<div className={styles.inputGroup}>
					<FormInput
						icon={<FaLock size={16} />}
						type="password" name="newPassword" required
						autoComplete="new-password" label="Nova Senha"
						value={formData.newPassword} handleChange={handleChange}
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
					type="password" name="confirmPassword" required
					autoComplete="new-password" label="Confirmar Senha"
					value={formData.confirmPassword} handleChange={handleChange}
					maxLength={RULES.senha.max}
					error={touched.confirmPassword ? errors.confirmPassword : null}
					onBlur={() => handleBlur("confirmPassword")}
				/>

				<FormButton disabled={loading}>
					{loading ? "Salvando..." : "Salvar nova senha"}
				</FormButton>
			</FormSection>
		</>
	);
}
