import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiLogOut, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { getUser, limparSessao } from "../../services/auth";
import { apiFetch } from "../../services/api";
import styles from "./Perfil.module.css";

export default function Perfil() {
	const navigate  = useNavigate();
	const user      = getUser();

	const nome  = user?.nome_completo_usuario ?? user?.fullName ?? user?.name ?? "Usuário";
	const email = user?.email ?? "";
	const tel   = user?.phoneNumber ?? user?.telefone ?? "";

	// estado de edição de senha
	const [editandoSenha,    setEditandoSenha]    = useState(false);
	const [senhaForm,        setSenhaForm]         = useState({ atual: "", nova: "", confirmar: "" });
	const [senhaErro,        setSenhaErro]         = useState(null);
	const [senhaSucesso,     setSenhaSucesso]      = useState(false);
	const [loadingSenha,     setLoadingSenha]      = useState(false);

	const handleSenhaChange = (k, v) => {
		setSenhaForm(p => ({ ...p, [k]: v }));
		setSenhaErro(null);
	};

	const handleSalvarSenha = async (e) => {
		e.preventDefault();
		if (senhaForm.nova !== senhaForm.confirmar) {
			setSenhaErro("As senhas não coincidem.");
			return;
		}
		if (senhaForm.nova.length < 8) {
			setSenhaErro("A nova senha deve ter pelo menos 8 caracteres.");
			return;
		}
		setLoadingSenha(true);
		try {
			await apiFetch("/auth/change-password", {
				method: "POST",
				body: JSON.stringify({
					currentPassword: senhaForm.atual,
					newPassword:     senhaForm.nova,
					confirmPassword: senhaForm.confirmar,
				}),
			});
			setSenhaSucesso(true);
			setEditandoSenha(false);
			setSenhaForm({ atual: "", nova: "", confirmar: "" });
			setTimeout(() => setSenhaSucesso(false), 3000);
		} catch (err) {
			setSenhaErro(err.message);
		} finally {
			setLoadingSenha(false);
		}
	};

	const handleSair = () => {
		limparSessao();
		navigate("/entrar");
	};

	return (
		<main className={styles.page}>
			<p className={styles.breadcrumb}>🏠 &gt; Perfil</p>
			<h1 className={styles.titulo}>Meu Perfil</h1>

			{/* card de dados */}
			<div className={styles.card}>
				{/* avatar */}
				<div className={styles.avatarWrap}>
					<div className={styles.avatar}>
						{nome.charAt(0).toUpperCase()}
					</div>
				</div>

				<div className={styles.info}>
					<div className={styles.infoRow}>
						<FiUser size={16} className={styles.infoIcon}/>
						<div>
							<p className={styles.infoLabel}>Nome</p>
							<p className={styles.infoValor}>{nome}</p>
						</div>
					</div>

					<div className={styles.infoRow}>
						<FiMail size={16} className={styles.infoIcon}/>
						<div>
							<p className={styles.infoLabel}>E-mail</p>
							<p className={styles.infoValor}>{email || "—"}</p>
						</div>
					</div>

					{tel && (
						<div className={styles.infoRow}>
							<FiPhone size={16} className={styles.infoIcon}/>
							<div>
								<p className={styles.infoLabel}>Telefone</p>
								<p className={styles.infoValor}>{tel}</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* card de senha */}
			<div className={styles.card}>
				<div className={styles.cardHeader}>
					<div className={styles.cardHeaderLeft}>
						<FiLock size={18}/>
						<h2>Segurança</h2>
					</div>
					{!editandoSenha && (
						<button className={styles.editBtn} onClick={() => setEditandoSenha(true)}>
							<FiEdit2 size={14}/> Alterar senha
						</button>
					)}
				</div>

				{senhaSucesso && (
					<p className={styles.sucesso}>Senha alterada com sucesso!</p>
				)}

				{!editandoSenha ? (
					<p className={styles.senhaPlaceholder}>••••••••••••</p>
				) : (
					<form onSubmit={handleSalvarSenha} className={styles.senhaForm}>
						{senhaErro && <p className={styles.erro}>{senhaErro}</p>}

						<div className={styles.formGroup}>
							<label>Senha atual</label>
							<input
								type="password"
								value={senhaForm.atual}
								onChange={e => handleSenhaChange("atual", e.target.value)}
								required
								className={styles.input}
								placeholder="Digite sua senha atual"
							/>
						</div>

						<div className={styles.formGroup}>
							<label>Nova senha</label>
							<input
								type="password"
								value={senhaForm.nova}
								onChange={e => handleSenhaChange("nova", e.target.value)}
								required
								className={styles.input}
								placeholder="Mínimo 8 caracteres"
							/>
						</div>

						<div className={styles.formGroup}>
							<label>Confirmar nova senha</label>
							<input
								type="password"
								value={senhaForm.confirmar}
								onChange={e => handleSenhaChange("confirmar", e.target.value)}
								required
								className={styles.input}
								placeholder="Repita a nova senha"
							/>
						</div>

						<div className={styles.senhaAcoes}>
							<button type="button" className={styles.cancelarBtn} onClick={() => { setEditandoSenha(false); setSenhaErro(null); }}>
								<FiX size={14}/> Cancelar
							</button>
							<button type="submit" className={styles.salvarBtn} disabled={loadingSenha}>
								<FiCheck size={14}/> {loadingSenha ? "Salvando..." : "Salvar senha"}
							</button>
						</div>
					</form>
				)}
			</div>

			{/* botão sair */}
			<div className={styles.sairWrap}>
				<button className={styles.sairBtn} onClick={handleSair}>
					<FiLogOut size={16}/> Sair da conta
				</button>
			</div>
		</main>
	);
}
