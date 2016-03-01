const express = require('express')
const mustacheExpress = require('mustache-express')
const packpath = require('packpath')
const path = require('path')

const app = express()
module.exports = app

app.engine('html', mustacheExpress())

app.set('view engine', 'mustache')
app.set('views', path.join(packpath.self(), 'views'))

app.get('/', function (req, res) {
  res.render('index.html', {message: 'Hello world!'})
})
