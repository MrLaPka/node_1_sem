const WebSocketServer = require("rpc-websockets").Server;

const server = new WebSocketServer({
  port: 4000,
  host: "localhost"
});

server.register("A", () => console.log("notify A")).public();
server.register("B", () => console.log("notify B")).public();
server.register("C", () => console.log("notify 06C")).public();
