'use strict'
const http = require('http')
const fibonacci = require('./fibonacci')

http.createServer((req, res) => {
  const n = Number(req.url.substr(1))
  if (Number.isNaN(n)) return res.end()
  
  const response = fibonacci(n)
  res.end(response.toString())
}).listen(3456)
