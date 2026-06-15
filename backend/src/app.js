import express from "express";
import cors from "cors";

import "dotenv/config";
import { routes } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

class App {
	constructor() {
		this.server = express();
		this.middlewares();
		this.routes();
		this.errorMiddleware();
	}

	middlewares() {
		this.server.use(cors());
		this.server.use(express.json());
	}

	routes() {
		this.server.use("/api", routes);
	}

	errorMiddleware() {
		this.server.use(errorMiddleware);
	}
}

export default new App().server;
