import server from "./app.js";

const port = process.env.PORT || 3000;

const httpServer = server.listen(port, () => {
	console.log(`Servidor iniciado na porta ${port}`);
});

httpServer.on("error", (err) => {
	console.log("Erro ao iniciar o servidor: ", err);
});
