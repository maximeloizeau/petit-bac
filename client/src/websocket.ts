import socketIo from "socket.io-client";
import { login } from "./handlers/login";
import { onEvent } from "./handlers/onEvent";
const host = "localhost:8888";

// A new Websocket connection is initialized with the server
const ws = socketIo(`http://${host}/`);
ws.on("close", (e: any) => {
  console.log("close ws connection: ", e.code, e.reason);
});
ws.on("event", onEvent);

login(ws);

export function sendAction({
  action,
  ...data
}: {
  action: string;
  [key: string]: any;
}) {
  ws.emit("action", { action, ...data });
}
