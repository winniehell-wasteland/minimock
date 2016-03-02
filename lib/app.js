const _ = require('lodash')
const constants = require('./constants')
const express = require('express')
const fs = require('fs-extra')
const resources = require('./resources')

const app = express()
module.exports = app

app.engine('html', constants.templateEngine)
app.engine('json', constants.templateEngine)
app.engine('xml', constants.templateEngine)

app.set('view engine', 'mustache')
app.set('views', [constants.viewPath, constants.resourcesPath])

app.get('/', displayConfiguration)
app.use(displayTemplate)

app.use(function (req, res) {
  res.status(404).send('Not found!')
})

function displayConfiguration (req, res) {
  resources.retrieveAvailableResources(constants.resourcesPath, function (resources) {
    const config = fs.readJsonSync(constants.configPath)
    resources.map(function (resource) {
      var configItem = _.find(config, {resource: _.omit(resource, ['availableResponses'])})
      resource.selectedResponse = configItem.response
    })
    res.render('index.html', {resources: resources})
  })
}

function displayTemplate (req, res, next) {
  resources.retrieveAvailableResources(constants.resourcesPath, function (resources) {
    const config = fs.readJsonSync(constants.configPath)
    const matchingResource = _.find(resources, function (resource) {
      return resource.isMatchingRequest(req)
    })
    const configItem = _.find(config, {resource: _.omit(matchingResource, ['availableResponses'])})

    if (matchingResource) {
      var matchingResponse = _.find(matchingResource.availableResponses, {statusCode: configItem.response.statusCode})
      if (matchingResponse) {
        res.status(matchingResponse.statusCode)
        res.render(matchingResponse.templatePath, matchingResponse.values)
        return
      }
    }
    next()
  })
}
