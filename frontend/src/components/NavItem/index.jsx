import { NavLink } from "react-router-dom";
import styles from "./NavItem.module.css";

export default function NavItem({ to, children }) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
		>
			{children}
		</NavLink>
	);
}
