var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var collect = require('@turf/destination');
 
const portNumber = process.env.port || 3000;
 
http.listen(portNumber);

app.use(express.static(__dirname));
 
 
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
 
console.log("server running on port 3000");