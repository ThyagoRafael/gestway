import server from "./app.js";
import { verifySMTPConnection } from "./config/email.js";

const port = process.env.PORT || 3000;

try {
	await verifySMTPConnection();
} catch (error) {
	console.error("Não foi possível conectar ao SMTP:", error);
	process.exit(1);
}

const httpServer = server.listen(port, () => {
	console.log(`Servidor iniciado na porta ${port}`);
});

httpServer.on("error", (err) => {
	console.log("Erro ao iniciar o servidor: ", err);
});
