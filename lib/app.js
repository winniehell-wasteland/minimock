const express = require('express')
const mustacheExpress = require('mustache-express')
const packpath = require('packpath')
const path = require('path')
const templates = require('./templates')

const app = express()
module.exports = app

app.engine('html', mustacheExpress())

app.set('view engine', 'mustache')
app.set('views', path.join(packpath.self(), 'views'))

app.get('/', function (req, res) {
  const templatePath = path.join(packpath.self(), 'templates')
  templates.list(templatePath, function (templateFiles) {
    res.render('index.html', {templateFiles: templateFiles})
  })
})
