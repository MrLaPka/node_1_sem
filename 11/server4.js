const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4000, host: "localhost" });
let n = 0;
wss.on("connection", ws => {
  ws.on("message", data => {
    console.log("on message: ", data.toString());
    n++;
    ws.send(
      JSON.stringify({
        server: n,
        client: JSON.parse(data).client,
        timestamp: new Date().toISOString()
      })
    );
  });
});
