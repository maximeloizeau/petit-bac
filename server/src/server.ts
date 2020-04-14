import { Server } from "http";
import app from "./app";
import websocketApp from "./websocketApp";

const server = new Server(app);
websocketApp(server);

const port = parseInt(process.env.PORT || "") || 8888;
server.listen(port, () => {
  console.log("App is running");
});

export default server;
