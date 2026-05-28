import styles from "./FormOptions.module.css";

export default function FormOptions({ children }) {
	return <div className={styles["form-options"]}>{children}</div>;
}
