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

  app.use(function (req, res) {
    for (var templateFile of templateFiles) {
      if (req.method.toLowerCase() !== templateFile.method) {
        continue
      }

      if (req.path !== templateFile.requestPath) {
        continue
      }

      res.render(templateFile.filePath)
    }
  })
}
