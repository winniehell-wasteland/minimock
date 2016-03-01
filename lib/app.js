const express = require('express')
const app = express()

module.exports = app

app.get('/', function (req, res) {
  res.send('Hello World!')
})
