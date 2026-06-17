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
	hint,
}) {
	return (
		<div className={styles["form-group-wrapper"]}>
			<div className={`${styles["form-group"]} ${error ? styles["form-group--error"] : ""}`}>
				{icon}
				<div className={styles["input-field"]}>
					<input
						type={type}
						name={name}
						id={name}
						required={required}
						autoComplete={autoComplete}
						placeholder=" "
						value={value ?? ""}
						maxLength={maxLength}
						onChange={(e) => handleChange && handleChange(e.target.name, e.target.value)}
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
			{hint && !error && <p className={styles["hint-msg"]}>{hint}</p>}
		</div>
	);
}
