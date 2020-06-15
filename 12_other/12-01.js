const http = require('http');
const fs = require('fs');
const util = require('util');
const dateFormat = require('dateformat');
const url = require('url');
const moment = require('moment');
const WebSocketServer = require('rpc-websockets').Server;

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const hostname = '127.0.0.1';
const httpServerPort = 3000;
const wsServerPort = 4000;
const staticDirectoryPath = './static';
const studentsFileName = 'students.json';
const studentsFile = `${staticDirectoryPath}/${studentsFileName}`;

const webSocketServer = new WebSocketServer({
  port: wsServerPort,
  host: 'localhost',
});

webSocketServer.event('students-change');

fs.watch(staticDirectoryPath, (eventType, filename) => {
  if (eventType === 'change' && filename.includes(studentsFileName)) {
    webSocketServer.emit('students-change', filename);
  }
});

http.createServer((request, response) => {

  switch (request.method) {
    case 'GET':
      routeGet(request, response);
      break;
    case 'POST':
      routePost(request, response);
      break;
    case 'PUT':
      routePut(request, response);
      break;
    case 'DELETE':
      routeDelete(request, response);
      break;
    default:
      response.statusCode = 405;
      response.end();
  }
}).listen(httpServerPort, hostname, () => {
  console.log(`Server running at http://${hostname}:${httpServerPort}/`);
});

async function routeGet(request, response) {
  switch (request.url) {
    case '/':
      fs.readFile(studentsFile, (err, data) => {
        if (err) {
          console.error(err);
          responseCode(response, (err.code === 'ENOENT') ? 404 : 500);
          return;
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(data);
      });
      break;
    case '/backup':
      const copies = await getCopies(studentsFileName);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(copies));
      break;
    default:
      const urlParts = parseUrl(request.url);
      if (urlParts.length !== 2) {
        responseCode(response, 400);
        return;
      }

      const id = urlParts[1];
      if (!Number.isInteger(parseInt(id))) {
        responseCode(response, 400);
        return;
      }

      fs.readFile(studentsFile, (err, data) => {
        if (err) {
          console.error(err);
          responseCode(response, (err.code === 'ENOENT') ? 404 : 500);
          return;
        }

        const studentsJson = JSON.parse(data);
        const student = findById(studentsJson, id);

        if (!student) {
          responseCode(response, 404);
          return;
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(student));
      });
  }
}

function routePost(request, response) {
  switch (request.url) {
    case '/':
      let body = '';
      request.on('data', chunk => {
        body += chunk.toString();
      });
      request.on('end', () => {
        const studentJson = JSON.parse(body);
        const studentId = studentJson.id;

        fs.readFile(studentsFile, (err, data) => {
          if (err) {
            console.error(err);
            responseCode(response, (err.code === 'ENOENT') ? 404 : 500);
            return;
          }

          const studentsJson = JSON.parse(data);
          const student = findById(studentsJson, studentId);

          if (student) {
            responseCode(response, 400);
          } else {
            studentsJson.push(studentJson);

            fs.writeFile(studentsFile, JSON.stringify(studentsJson), function (err) {
              if (err) {
                console.error(err);
                responseCode(response, (err.code === 'ENOENT') ? 404 : 500);
                return;
              }
              response.writeHead(201);
              response.end();
            });
          }
        });
      });
      break;
    case '/backup':
      setTimeout(() => {
        backupFile(staticDirectoryPath, studentsFileName);
      }, 2000);
      response.statusCode = 201;
      response.end();
      break;
    default:
      responseCode(response, 404);
  }
}

function routePut(request, response) {
  if (request.url === '/') {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const newStudent = JSON.parse(body);

      const newStudentId = newStudent.id;

      fs.readFile(studentsFile, (err, data) => {
        if (err) {
          console.error(err);
          responseCode(response, (err.code === 'ENOENT') ? 404 : 500);
          return;
        }

        const students = JSON.parse(data);
        const student = findById(students, newStudentId);
        if (!student) {
          responseCode(response, 404);
          return;
        }
        const updatedStudents = replaceById(students, newStudent);
        console.log(updatedStudents);
        fs.writeFile(studentsFile, JSON.stringify(updatedStudents), function (err) {
          if (err) {
            console.error(err);
            responseCode(response, 500);
            return;
          }
          response.statusCode = 200;
          response.end();
        });
      });
    });
  } else {
    responseCode(response, 404);
  }
}

async function routeDelete(request, response) {
  const parsedUri = url.parse(request.url);
  const urlParts = parsedUri.pathname.split('/').filter(part => part.length !== 0);

  if (parsedUri.pathname.startsWith('/backup')) {
    if (urlParts.length !== 2) {
      responseCode(response, 404);
      return;
    }

    const rawDate = urlParts[1];
    const parsedDate = parseDate(rawDate, 'YYYYMMDD');

    if (!parsedDate) {
      responseCode(response, 400);
      return;
    }

    await deleteCopiesLaterThen(parsedDate);
    responseCode(response, 204);
    return;
  }

  if (parsedUri.pathname.startsWith('/')) {
    if (urlParts.length !== 1) {
      responseCode(response, 404);
      return;
    }

    const id = urlParts[0];
    if (!Number.isInteger(parseInt(id))) {
      responseCode(response, 400);
      return;
    }

    let studentsData;
    try {
      studentsData = await readFile(studentsFile);
    } catch (err) {
      console.error(err);
      responseCode(response, (err.code === 'ENOENT') ? 404 : 500);
      return;
    }

    const studentsJson = JSON.parse(studentsData);
    const student = findById(studentsJson, id);
    if (!student) {
      responseCode(response, 404);
      return;
    }

    const updatedStudents = deleteById(studentsJson, student.id);
    fs.writeFile(studentsFile, JSON.stringify(updatedStudents), function (err) {
      if (err) {
        console.error(err);
        responseCode(response, 500);
        return;
      }
      response.statusCode = 204;
      response.end();
    });
  }
}

function parseDate(rawDate, format) {
  const momentDate = moment(rawDate, format);
  return momentDate.toDate();
}

function replaceById(sourceElements, newElement) {
  return sourceElements.map(e => {
    return e.id === newElement.id ? newElement : e;
  });
}

function deleteById(sourceElements, id) {
  return sourceElements.filter(e => {
    return e.id !== id;
  });
}

function findById(elements, id) {
  return elements.find(e => {
    return e.id === id;
  });
}

function parseUrl(url) {
  return url.split('/');
}

function backupFile(sourcePath, sourceFileName) {
  const copyFileName = `${sourcePath}/${dateFormat(
    new Date(),
    'yyyymmddhhMMss')}_${sourceFileName}`;
  fs.copyFile(`${sourcePath}/${sourceFileName}`, copyFileName, (err) => {
    if (err) throw err;
    console.log(`${sourceFileName} was copied to ${copyFileName}`);
  });
}

async function getCopies(fileName, optionalFilter, filterValue) {
  const items = await readdir(staticDirectoryPath);
  const fileNameFiltered = items.filter(e => {
    return e.includes(fileName) && e !== fileName;
  });

  if (optionalFilter) {
    return fileNameFiltered.filter(e => optionalFilter(e, filterValue));
  }
  return fileNameFiltered;
}

async function deleteCopiesLaterThen(date) {
  const copiesToDelete = await getCopies(studentsFileName, (copy, date) => {
    const rawCopyDate = copy.substr(0, copy.indexOf('_'));
    const parsedDate = parseDate(rawCopyDate, 'YYYYMMDDhhmmss');
    return parsedDate > date;
  }, date);
  console.log('To be deleted: ', copiesToDelete);

  copiesToDelete.forEach(copy => {
    fs.unlink(`${staticDirectoryPath}/${copy}`, (err) => {
      if (err) throw err;
      console.log(`${copy} was deleted`);
    });
  });
}

function responseCode(res, code) {
  res.statusCode = code;
  res.end();
}