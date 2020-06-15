const WebSocket = require('rpc-websockets').Client;
const ws = new WebSocket('ws://localhost:4000');

ws.on('open', function () {
  ws.subscribe('students-change');
  console.log('Listening for students-change events...');
  ws.on('students-change', (filename) => console.log(`${new Date()} ${filename} was changed`));
});