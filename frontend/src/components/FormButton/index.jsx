import styles from "./FormButton.module.css";

export default function FormButton({ children, disabled }) {
	return (
		<button
			type="submit"
			className={styles.button}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
