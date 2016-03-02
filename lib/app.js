const accept = require('accept')
const constants = require('./constants')
const express = require('express')
const fs = require('fs-extra')
const templates = require('./templates')

const app = express()
module.exports = app

app.engine('html', constants.templateEngine)
app.engine('json', constants.templateEngine)
app.engine('xml', constants.templateEngine)

app.set('view engine', 'mustache')
app.set('views', [constants.viewPath, constants.templatePath])

templates.list(constants.templatePath, onTemplatesLoaded)

function isMatchingConfig (templateFile) {
  return function (configItem) {
    return (templateFile.requestPath === configItem.requestPath) &&
      (templateFile.method === configItem.method) &&
      (templateFile.extension === configItem.extension)
  }
}

function onTemplatesLoaded (templateFiles) {
  app.get('/', displayConfiguration)
  app.use(displayTemplate)

  app.use(function (req, res) {
    res.status(404).send('Not found!')
  })

  function displayConfiguration (req, res) {
    const config = fs.readJsonSync(constants.configPath)
    const configItems = templateFiles.map(convertTemplateFileToConfigItem)
    res.render('index.html', {configItems: configItems})

    function convertTemplateFileToConfigItem (templateFile) {
      const item = {
        templateFile: templateFile,
        config: config.find(isMatchingConfig(templateFile))
      }
      return item
    }
  }

  function displayTemplate (req, res, next) {
    const config = fs.readJsonSync(constants.configPath)
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
          var configItem = config.find(isMatchingConfig(templateFile))

          if (configItem.statusCode === templateFile.statusCode) {
            res.status(configItem.statusCode)
            res.render(templateFile.filePath)
            return
          }
        }
      }
    }
    next()
  }
}
