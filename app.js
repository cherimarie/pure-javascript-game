const http = require('http');
var fs = require("fs");
var url = require("url");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(req.url)
  var pathname = url.parse(req.url).pathname;

  if(pathname == "/") {
    fs.readFile("index.html", function(err, data){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(data);
      res.end();
    });
  } else if(pathname == "/gameplay.js"){
    fs.readFile("gameplay.js", function(err, data){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/javascript');
      res.write(data);
      res.end();
    });
  } else {
    res.statusCode = 400;
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});