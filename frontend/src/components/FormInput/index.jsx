import styles from "./FormInput.module.css";

export default function FormInput({ icon, type, name, required, autoComplete, label, value, handleChange }) {
	return (
		<div className={styles["form-group"]}>
			{icon}
			<div className={styles["input-field"]}>
				<input
					type={type}
					name={name}
					id={name}
					required={required}
					autoComplete={autoComplete}
					placeholder=" "
					value={value}
					onChange={(e) => handleChange(e.target.name, e.target.value)}
				/>
				<label htmlFor={name}>{label}</label>
			</div>
		</div>
	);
}
