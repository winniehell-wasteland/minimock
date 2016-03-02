const accept = require('accept')
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

  app.use(function (req, res, next) {
    for (var templateFile of templateFiles) {
      if (req.method.toLowerCase() !== templateFile.method) {
        continue
      }

      if (req.path !== templateFile.requestPath) {
        continue
      }

      for (var mimeType of accept.mediaTypes(req.headers.accept)) {
        var isMimeTypeSupported = mimeType.endsWith('*') ||
          mimeType.endsWith('/' + templateFile.extension) ||
          mimeType.endsWith('+' + templateFile.extension)
        if (isMimeTypeSupported) {
          res.render(templateFile.filePath)
          return
        }
      }
    }
    next()
  })

  app.use(function (req, res) {
    res.status(404).send('Not found!')
  })
}
