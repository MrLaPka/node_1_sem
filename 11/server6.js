const WebSocketServer = require("rpc-websockets").Server;

const server = new WebSocketServer({
  port: 4000,
  host: "localhost"
});

server.event("A");
server.event("B");
server.event("C");

const stdin = process.openStdin();

stdin.addListener("data", d => {
  if (d.toString().trim() === "A") server.emit("A");
  if (d.toString().trim() === "B") server.emit("B");
  if (d.toString().trim() === "C") server.emit("C");
});
