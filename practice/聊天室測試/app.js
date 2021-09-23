
const http = require('http');

const hostName = 'localhost';

const port = 3000;
const app = express();
const server = http.createServer(app);
require('./config/websocketConfig').websocket(app,sessionParser,server,port);
const session = require('express-session');






server.listen(port,hostName,()=>{
  console.log(`The server is listening on http://${hostName}:port ${port}.`);
});



