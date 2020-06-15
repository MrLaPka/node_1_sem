const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4000, host: "localhost" });
let name = 0;
let n = 0;
wss.on("connection", ws => {
  ws.on("pong", data => {
    console.log("on pong: ", data.toString());
  });
  setInterval(() => {
    console.log("count of clients: ", wss.clients.size);
    ws.ping("some");
  }, 5000);
  setInterval(() => {
    n++;
    ws.send(`11-03-server: ${n}`);
  }, 15000);
});
