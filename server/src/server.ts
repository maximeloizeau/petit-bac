import { Server } from "http";
import app from "./app";
import websocketApp from "./websocketApp";

const server = new Server(app);
websocketApp(server);

server.listen(8888, "127.0.0.1", () => {
  console.log("App is running");
});

export default server;
