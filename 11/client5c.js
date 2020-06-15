const async = require("async");
const WebSocket = require("rpc-websockets").Client;
const ws = new WebSocket("ws://localhost:4000");

//sum( square(3), square(5,4), mul(3,5,7,9,11,13) ) + fib(7) * mul(2,4,6)

let h = () =>
  async.waterfall(
    [
      cb => {
        ws.call("mul", [2, 4, 6])
          .catch(e => cb(e, null))
          .then(r => cb(null, r));
      },
      (p, cb) => {
        ws.login({
          login: "smw",
          password: "777"
        }).then(login => {
          if (login) {
            ws.call("fib", [7])
              .catch(e => cb(e, null))
              .then(r => {
                r.push(p);
                cb(null, r);
              });
          } else {
            console.error("Login error");
          }
        });
      },
      (p, cb) => {
        ws.call("mul", p)
          .catch(e => cb(e, null))
          .then(r => cb(null, [r]));
      },
      (p, cb) => {
        ws.call("square", [3])
          .catch(e => cb(e, null))
          .then(r => {
            p.push(r);
            cb(null, p);
          });
      },
      (p, cb) => {
        ws.call("square", [5, 4])
          .catch(e => cb(e, null))
          .then(r => {
            p.push(r);
            cb(null, p);
          });
      },
      (p, cb) => {
        ws.call("mul", [3, 5, 7, 9, 11, 13])
          .catch(e => cb(e, null))
          .then(r => {
            p.push(r);
            cb(null, p);
          });
      },
      (p, cb) => {
        ws.call("sum", p)
          .catch(e => cb(e, null))
          .then(r => cb(null, [r]));
      }
    ],
    (e, r) => {
      if (e) console.error(`An error occurred:`, e);
      else console.log(`Result: ${r}`);
      ws.close();
    }
  );

ws.on("open", h);
