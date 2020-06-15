const WebSocket = require("rpc-websockets").Client;
const ws = new WebSocket("ws://localhost:4000");

ws.on("open", function() {

  const stdin = process.openStdin();

  stdin.addListener("data", d => {
    if (d.toString().trim() === "A") ws.notify("A");
    if (d.toString().trim() === "B") ws.notify("B");
    if (d.toString().trim() === "C") ws.notify("C");
  });
});
