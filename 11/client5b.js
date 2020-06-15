const async = require("async");
const WebSocket = require("rpc-websockets").Client;
const ws = new WebSocket("ws://localhost:4000");

let h = (x = ws) =>
  async.parallel(
    {
      square: cb => {
        ws.call("square", [3])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      square1: cb => {
        ws.call("square", [5, 4])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      sum: cb => {
        ws.call("sum", [2])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      sum1: cb => {
        ws.call("sum", [2, 4, 6, 8, 10])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      mul: cb => {
        ws.call("mul", [3])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      mul1: cb => {
        ws.call("mul", [3, 5, 7, 9, 11, 13])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      fibfact: cb => {
        ws.login({ login: "smw", password: "777" }).then(login => {
          if (login)
            ws.call("fib", [1])
              .catch(e => cb(e, null))
              .then(r => cb(null, r));
          else cb({ message1: "login error" }, null);
        });
      },
      fibfact1: cb => {
        ws.login({ login: "smw", password: "777" }).then(login => {
          if (login)
            ws.call("fib", [2])
              .catch(e => cb(e, null))
              .then(r => cb(null, r));
          else cb({ message1: "login error" }, null);
        });
      },
      fibfact2: cb => {
        ws.login({ login: "smw", password: "777" }).then(login => {
          if (login)
            ws.call("fib", [7])
              .catch(e => cb(e, null))
              .then(r => cb(null, r));
          else cb({ message1: "login error" }, null);
        });
      },
      fibfact3: cb => {
        ws.login({ login: "smw", password: "777" }).then(login => {
          if (login)
            ws.call("fact", [0])
              .catch(e => cb(e, null))
              .then(r => cb(null, r));
          else cb({ message1: "login error" }, null);
        });
      },
      fibfact4: cb => {
        ws.login({ login: "smw", password: "777" }).then(login => {
          if (login)
            ws.call("fact", [5])
              .catch(e => cb(e, null))
              .then(r => cb(null, r));
          else cb({ message1: "login error" }, null);
        });
      },
      fibfact5: cb => {
        ws.login({ login: "smw", password: "777" }).then(login => {
          if (login)
            ws.call("fact", [10])
              .catch(e => cb(e, null))
              .then(r => cb(null, r));
          else cb({ message1: "login error" }, null);
        });
      }
    },
    (e, r) => {
      if (e) console.log("e = ", e);
      else console.log("r = ", r);
      ws.close();
    }
  );
ws.on("open", h);