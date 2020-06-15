const fs = require("fs");
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:4000");

ws.on("open", () => {
  const duplex = WebSocket.createWebSocketStream(ws, { encoding: "utf8" });
  const rfile = fs.createReadStream('./name.txt');
  rfile.pipe(duplex);
});
