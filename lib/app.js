const express = require('express')
const mustacheExpress = require('mustache-express')
const config = require('./config')
const templates = require('./templates')

const app = express()
module.exports = app

app.engine('html', mustacheExpress())

app.set('view engine', 'mustache')
app.set('views', config.viewPath)

app.get('/', function (req, res) {
  templates.list(config.templatePath, function (templateFiles) {
    res.render('index.html', {templateFiles: templateFiles})
  })
})
