const express = require('express')
const config = require('./config')
const templates = require('./templates')

const app = express()
module.exports = app

app.engine('html', config.templateEngine)
app.engine('json', config.templateEngine)
app.engine('xml', config.templateEngine)

app.set('view engine', 'mustache')
app.set('views', [config.viewPath, config.templatePath])

templates.list(config.templatePath, onTemplatesLoaded)

function onTemplatesLoaded (templateFiles) {
  app.get('/', function (req, res) {
    res.render('index.html', {templateFiles: templateFiles})
  })

  templateFiles.forEach(function (templateFile) {
    app.get(templateFile.path, function (req, res) {
      res.render(templateFile.path.substr(1))
    })
  })
}
