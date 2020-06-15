const fs = require('fs');
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4000, host:'localhost' });
let name = 0;
wss.on("connection", ws => {
  const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
  let wfile = fs.createWriteStream(`./upload/${++name}.txt`);
  duplex.pipe(wfile);
});
