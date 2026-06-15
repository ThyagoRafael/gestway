import styles from "./FormButton.module.css";

export default function FormButton({ children }) {
	return (
		<button
			type="submit"
			className={styles.button}
		>
			{children}
		</button>
	);
}
