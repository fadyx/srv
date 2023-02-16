import { createServer, m } from "@/server";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const port = process.env.APP_PORT || 3003;
const server = createServer();

server.listen(port);
console.log("server is listening...", process.env.APP_PORT, m);
