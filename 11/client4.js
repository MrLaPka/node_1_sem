const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:4000");

ws.on("open", () => {
  ws.on("message", m => {
    console.log("message ", m);
  });
  const stdin = process.openStdin();

  stdin.addListener("data", d => {
      ws.send(
          JSON.stringify({
              client: d.toString().trim(),
              timestamp: new Date().toISOString()
          })
      );
  });
});
