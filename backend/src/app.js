import express from "express";

import "dotenv/config";

class App {
	constructor() {
		this.server = express();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.server.use(express.json());
	}

	routes() {
		this.server.use("/api");
	}
}

export default new App().server;
