// A static file server for development use.
// By Curran Kelleher 3/26/2014
//
// Run in the background with the shell command "node server.js &".
// Install dependencies with "npm install"
// (first install Node.js, see https://github.com/joyent/node/wiki/Installation
var port = 8000,
    express = require('express'),
    app = express();

// Serve files from the parent directory.
app.use('/', express.static(__dirname + '/../'));

app.listen(port);
console.log('Now serving http://localhost:'+port+'/index.html');
