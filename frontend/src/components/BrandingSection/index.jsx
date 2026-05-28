import styles from "./BrandingSection.module.css";

export default function BrandingSection() {
	return (
		<section className={styles["branding-section"]}>
			<header>
				<h1>GestWay</h1>
			</header>

			<p>Seu destino para a gestão inteligente</p>
		</section>
	);
}
