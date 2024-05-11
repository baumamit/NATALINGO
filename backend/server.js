const http = require('http');
const app = require('./app');

// Assign your "environment variable" already set on the "deployment server" (host), or port 3000 as a default
const port = process.env.PORT || 3000;
console.log(`Listening to port: ${port}`);

// Create a server that executes for each request the 'request handler', for example named 'app' (the variable in the parentheses)
const server = http.createServer(app);

// Listen to port for incoming requests
server.listen(port);