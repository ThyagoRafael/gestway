import styles from "./FormInput.module.css";

export default function FormInput({
	icon,
	type,
	name,
	required,
	autoComplete,
	label,
	value,
	handleChange,
	maxLength,
	error,
	placeholder,   // placeholder cinza interno (ex: telefone)
	onBlur,
}) {
	// Se há placeholder externo, o input não usa " " — usa o placeholder real
	// e o label flutua sempre para cima via CSS (classe has-placeholder)
	const inputPlaceholder = placeholder ?? " ";

	return (
		<div className={styles["form-group-wrapper"]}>
			<div className={`${styles["form-group"]} ${error ? styles["form-group--error"] : ""}`}>
				{icon && <span className={styles.icon}>{icon}</span>}

				<div className={`${styles["input-field"]} ${placeholder ? styles["has-placeholder"] : ""}`}>
					<input
						type={type}
						name={name}
						id={name}
						required={required}
						autoComplete={autoComplete}
						placeholder={inputPlaceholder}
						value={value ?? ""}
						maxLength={maxLength}
						onChange={(e) => handleChange && handleChange(e.target.name, e.target.value)}
						onBlur={onBlur}
					/>
					<label htmlFor={name}>{label}</label>
				</div>

				{maxLength && value !== undefined && (
					<span className={styles["char-count"]}>
						{(value ?? "").length}/{maxLength}
					</span>
				)}
			</div>

			{error && <p className={styles["error-msg"]}>{error}</p>}
		</div>
	);
}
