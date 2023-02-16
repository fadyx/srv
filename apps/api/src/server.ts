import express from "express";
import morgan from "morgan";

export const m = { m: "mmm" };

export const createServer = () => {
	const app = express();
	app.disable("x-powered-by")
		.use(morgan("dev"))
		.use(express.json())
		.get("/message/:name", (req, res) => {
			return res.json({ message: `hello ${req.params.name}` });
		})
		.get("/healthz", (req, res) => {
			return res.json({ ok: true });
		});

	return app;
};

export default createServer;
