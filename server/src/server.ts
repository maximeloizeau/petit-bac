import { Server } from "http";
import app from "./app";
import websocketApp from "./websocketApp";

const server = new Server(app);
websocketApp(server);

server.listen(process.env.PORT || 8888, () => {
  console.log("App is running");
});

export default server;
