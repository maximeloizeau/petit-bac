import socketIo from "socket.io-client";
import { login } from "./handlers/login";
import { onEvent } from "./handlers/onEvent";
const host = "https://49e99a3c.ngrok.io/";

// A new Websocket connection is initialized with the server
const ws = socketIo(host);
ws.on("close", (e: any) => {
  console.log("close ws connection: ", e.code, e.reason);
});
ws.on("connect", () => login(ws));
ws.on("disconnect", () =>
  alert("Disconnected from server - will attempt to reconnect now")
);
ws.on("event", onEvent);

export function sendAction({
  action,
  ...data
}: {
  action: string;
  [key: string]: any;
}) {
  ws.emit("action", { action, ...data });
}
