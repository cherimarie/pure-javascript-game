const http = require('http')
var fs = require('fs')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    fs.readFile('index.html', function (err, data) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.write(data)
      res.end()
    })
  } else if (req.url == '/bundle.js') {
    fs.readFile('bundle.js', function (err, data) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/javascript')
      res.write(data)
      res.end()
    })
  } else if (req.url == '/shrimp.png') {
    fs.readFile('shrimp.png', function (err, data) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'image')
      res.write(data)
      res.end()
    })
  } else {
    res.statusCode = 400
    res.end()
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
