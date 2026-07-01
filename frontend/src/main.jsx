import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "./contexts/ConfigContext.jsx";
import { CarrinhoProvider } from "./contexts/CarrinhoContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<ConfigProvider>
				<CarrinhoProvider>
				<App />
				</CarrinhoProvider>
			</ConfigProvider>
		</BrowserRouter>
	</StrictMode>,
);
