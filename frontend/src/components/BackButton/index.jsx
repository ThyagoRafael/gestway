import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./BackButton.module.css";

export default function BackButton({ label = "Voltar" }) {
	const navigate = useNavigate();
	return (
		<button className={styles.btn} onClick={() => navigate(-1)}>
			<FiArrowLeft size={15}/> {label}
		</button>
	);
}
