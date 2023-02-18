import { createServer, m } from "@/server";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const port = process.env.API_PORT;

const server = createServer();

server.listen(port);

console.log("server is listening...", process.env.API_PORT, m);
