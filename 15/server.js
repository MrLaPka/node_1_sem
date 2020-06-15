const MongoClient = require("mongodb").MongoClient(
  "mongodb://localhost:27017",
  {
    useUnifiedTopology: true
  }
);
const http = require("http");
const assert = require("assert");
let url = require("url");

const dbName = "bstu";

let server = http.createServer((req, res) => {
  MongoClient.connect((err, client) => {
    const db = client.db(dbName);

    if (
      req.method === "GET" &&
      url.parse(req.url).pathname === "/api/faculties"
    ) {
      showFaculties(db, res);
    } else if (
      req.method === "GET" &&
      url.parse(req.url).pathname === "/api/pulpits"
    ) {
      showPulpits(db, res);
    } else if (
      req.method === "POST" &&
      url.parse(req.url).pathname === "/api/faculties"
    ) {
      let data = "";

      req.on("data", chunk => {
        data += chunk;
      });
      req.on("end", () => {
        addFaculty(db, res, JSON.parse(data));
      });
    } else if (
      req.method === "POST" &&
      url.parse(req.url).pathname === "/api/pulpits"
    ) {
      let data = "";
      req.on("data", chunk => {
        data += chunk;
      });
      req.on("end", () => {
        addPulpit(db, res, JSON.parse(data));
      });
    } else if (req.method === "DELETE") {
      const path = decodeURI(url.parse(req.url).pathname);
      deleteHandler(db, res, path);
    } else if (
      req.method === "PUT" &&
      url.parse(req.url).pathname === "/api/faculties"
    ) {
      let data = "";
      req.on("data", chunk => {
        data += chunk;
      });
      req.on("end", () => {
        updateFaculty(db, res, JSON.parse(data));
      });
    } else if (
      req.method === "PUT" &&
      url.parse(req.url).pathname === "/api/pulpits"
    ) {
      let data = "";
      req.on("data", chunk => {
        data += chunk;
      });
      req.on("end", () => {
        updatePulpit(db, res, JSON.parse(data));
      });
    }
  });
});

server.listen(3000, () => {
  console.log("http server started");
});

const showPulpits = (db, res) => {
  const collection = db.collection("pulpit");
  collection.find().toArray((err, results) => {
    res.end(JSON.stringify(results));
  });
};

const showFaculties = (db, res) => {
  const collection = db.collection("faculty");
  collection.find().toArray((err, results) => {
    res.end(JSON.stringify(results));
  });
};

const addFaculty = (db, res, newFaculty) => {
  const collection = db.collection("faculty");
  collection.insertOne(newFaculty, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ err: err }));
    } else {
      res.end(JSON.stringify(result["ops"]));
    }
  });
};

const addPulpit = (db, res, newPulpit) => {
  const collection = db.collection("pulpit");
  collection.insertOne(newPulpit, (err, result) => {
    if (err) {
      res.end(JSON.stringify({ err: err }));
    } else {
      res.end(JSON.stringify(result["ops"]));
    }
  });
};

const deleteHandler = (db, res, path) => {
  switch (true) {
      case /\/api\/faculties\/.+/.test(path):
          {
              const collection = db.collection("faculty");
              collection.findOneAndDelete(
                  { faculty: path.split("/")[3] },
                  (err, result) => {
                      if (err) {
                          res.end(JSON.stringify({ err: err }));
                      } else {
                          res.end(JSON.stringify(result["value"]));
                      }
                  }
              );
          }
          break;
    case /\/api\/pulpits\/.+/.test(path):
      {
        const collection = db.collection("pulpit");
        collection.findOneAndDelete(
          { pulpit: path.split("/")[3] },
          (err, result) => {
            if (err) {
              res.end(JSON.stringify({ err: err }));
            } else {
              res.end(JSON.stringify(result["value"]));
            }
          }
        );
      }
      break;
    default:
      res.end("Bad req");
      break;
  }
};

const updatePulpit = (db, res, pulpit) => {
  const collection = db.collection("pulpit");
  collection.findOneAndUpdate(
    { pulpit: pulpit["pulpit"] },
    {
      $set: {
        pulpit: pulpit["newPulpit"],
        pulpit_name: pulpit["newPulpitName"],
        faculty: pulpit["newFaculty"]
      }
    },
    (err, result) => {
      if (err) {
        res.end(JSON.stringify({ err: err }));
      } else {
        res.end(JSON.stringify(result["value"]));
      }
    }
  );
};

const updateFaculty = (db, res, faculty) => {
  const collection = db.collection("faculty");
  collection.findOneAndUpdate(
    { faculty: faculty["faculty"] },
    {
      $set: {
        faculty: faculty["newFaculty"],
        faculty_name: faculty["newFacultyName"]
      }
    },
    (err, result) => {
      if (err) {
        res.end(JSON.stringify({ err: err }));
      } else {
        res.end(JSON.stringify(result["value"]));
      }
    }
  );
};
