import styles from "./FormSection.module.css";

export default function FormSection({ title, children, footer, handleSubmit }) {
	return (
		<main className={styles["form-section"]}>
			<header>
				<h2>{title}</h2>
			</header>

			<form
				className={styles.form}
				onSubmit={(e) => handleSubmit(e)}
			>
				{children}
			</form>

			<footer className={styles["form-footer"]}>{footer}</footer>
		</main>
	);
}
