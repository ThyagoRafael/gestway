import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

import BrandingSection from "../../../components/BrandingSection";
import FormButton      from "../../../components/FormButton";
import FormInput       from "../../../components/FormInput";
import FormOptions     from "../../../components/FormOptions";
import FormSection     from "../../../components/FormSection";

import { RULES, validarEmail } from "../../../utils/useAuthValidation";
import { login, salvarSessao } from "../../../services/auth";
import { useCarrinho } from "../../../contexts/CarrinhoContext"
import styles from "./Entrar.module.css";

export default function Entrar() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors,   setErrors]   = useState({});
	const [touched,  setTouched]  = useState({});
	const [loading,  setLoading]  = useState(false);
	const [apiError, setApiError] = useState(null);
	const [sucesso,  setSucesso]  = useState(null);

	const navigate = useNavigate();
	const location = useLocation();
	const { carregarCarrinho } = useCarrinho()

	useEffect(() => {
		if (location.state?.cadastroSucesso) {
			setSucesso("Conta criada com sucesso! Faça login para continuar.");
		}
		if (location.state?.resetSucesso) {
			setSucesso("Senha redefinida com sucesso! Faça login.");
		}
	}, [location.state]);

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
		const emailErr = validarEmail(data.email);
		if (emailErr) e.email = emailErr;
		if (!data.password)                              e.password = "Senha obrigatória.";
		else if (data.password.length < RULES.senha.min) e.password = `Mínimo ${RULES.senha.min} caracteres.`;
		return e;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errs = validate(formData);
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			setTouched({ email: true, password: true });
			return;
		}

		setLoading(true);
		setApiError(null);
		try {
			const data = await login({ email: formData.email, password: formData.password });
			salvarSessao(data.token, data.user);
			await carregarCarrinho()
			navigate("/");
		} catch (err) {
			setApiError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<BrandingSection />
			<FormSection
				title="Acesse sua plataforma"
				footer={
					<>
						<Link to="/cadastrar">Não tem conta? Cadastre-se agora</Link>
						<Link to="/esqueceu-senha">Esqueceu sua senha? Clique aqui</Link>
					</>
				}
				handleSubmit={handleSubmit}
			>
				{sucesso  && <p className={styles.sucesso}>{sucesso}</p>}
				{apiError && <p className={styles.apiError}>{apiError}</p>}

				<FormInput
					icon={<MdEmail size={16} />}
					type="email" name="email" required autoComplete="email" label="Email*"
					value={formData.email} handleChange={handleChange}
					maxLength={RULES.email.max}
					error={touched.email ? errors.email : null}
					onBlur={() => handleBlur("email")}
				/>

				<FormInput
					icon={<FaLock size={16} />}
					type="password" name="password" required autoComplete="current-password" label="Senha*"
					value={formData.password} handleChange={handleChange}
					maxLength={RULES.senha.max}
					error={touched.password ? errors.password : null}
					onBlur={() => handleBlur("password")}
				/>

				<FormOptions>
					<label htmlFor="remember">
						<input type="checkbox" id="remember" name="remember" />
						Manter conectado
					</label>
				</FormOptions>

				<FormButton disabled={loading}>
					{loading ? "Entrando..." : "Entrar"}
				</FormButton>
			</FormSection>
		</>
	);
}
