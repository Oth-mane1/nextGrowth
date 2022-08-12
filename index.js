import app from './app.js';
import { createServer } from 'http';
import dotenv from 'dotenv';
dotenv.config()

// Get port from environment 
var port = process.env.PORT || '5555';
app.set('port', port);

// Create HTTP server.
var server = createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  throw error;
}

function onListening() {
  var addr = server.address();
  console.log(`Server Alive At http://localhost:${addr.port}`);
}
