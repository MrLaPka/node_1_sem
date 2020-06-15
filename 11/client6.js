const WebSocket = require("rpc-websockets").Client;
const ws = new WebSocket("ws://localhost:4000");

ws.on("open", function() {
  ws.subscribe("A");
  ws.subscribe("B");
  ws.subscribe("C");

  ws.on("A", () => console.log("Emit A"));
  ws.on("B", () => console.log("Emit B"));
  ws.on("C", () => console.log("Emit C"));
});
