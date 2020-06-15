const WebSocketServer = require("rpc-websockets").Server;

// instantiate Server and start listening for requests
const server = new WebSocketServer({
  port: 4000,
  host: "localhost"
});

server.setAuth(l => l.login === "smw" && l.password === "777");

server
  .register("square", params => {
    if (params.length === 1) return params[0] * params[0] * Math.PI;
    return params[0] * params[1];
  })
  .public();

server
  .register("sum", params => {
    return params.reduce((sum, cur) => {
      return sum + cur;
    }, 0);
  })
  .public();

server
  .register("mul", params => {
    return params.reduce((mul, cur) => {
      return mul * cur;
    }, 1);
  })
  .public();

server
  .register("fib", params => {
    let arr = [0, 1];
    for (let i = 2; i < params[0] + 1; i++) {
      arr.push(arr[i - 2] + arr[i - 1]);
    }
    return arr;
  })
  .protected();

server
  .register("fact", params => {
    let fact = 1;
    for (let i = 1; i < params[0]; ++i) {
      fact *= i + 1;
    }
    return fact;
  })
  .protected();
