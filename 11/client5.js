const WebSocket = require("rpc-websockets").Client;
const ws = new WebSocket("ws://localhost:4000");

ws.on("open", function() {
  ws.call("square", [3]).then(result => {
    console.log(result);
  });

  ws.call("square", [5, 4]).then(result => {
    console.log(result);
  });

  ws.call("sum", [2]).then(result => {
    console.log(result);
  });

  ws.call("sum", [2, 4, 6, 8, 10]).then(result => {
    console.log(result);
  });

  ws.call("mul", [3]).then(result => {
    console.log(result);
  });

  ws.call("mul", [3, 5, 7, 9, 11, 13]).then(result => {
    console.log(result);
  });

  ws.login({ login: "smw", password: "777" }).then(login => {
    if (login) {
      ws.call("fib", [1]).then(result => {
        console.log(result);
      });

      ws.call("fib", [2]).then(result => {
        console.log(result);
      });

      ws.call("fib", [7]).then(result => {
        console.log(result);
      });

      ws.call("fact", [0]).then(result => {
        console.log(result);
      });

      ws.call("fact", [5]).then(result => {
        console.log(result);
      });

      ws.call("fact", [10]).then(result => {
        console.log(result);
      });
    } else console.log("login error");
  });
});
