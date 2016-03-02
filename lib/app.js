const _ = require('lodash')
const bodyParser = require('body-parser')
const constants = require('./constants')
const express = require('express')
const fs = require('fs-extra')
const packpath = require('packpath')
const path = require('path')
const resources = require('./resources')

const app = express()
module.exports = app

app.engine('html', constants.templateEngine)
app.engine('json', constants.templateEngine)
app.engine('xml', constants.templateEngine)

app.set('view cache', false)
app.set('view engine', 'mustache')
app.set('views', [constants.viewPath, constants.resourcesPath])

app.use(bodyParser.urlencoded({extended: true}))
app.use('/css', express.static(path.join(packpath.self(), 'css')))
app.get('/', displayConfiguration)
app.post('/', storeConfiguration)
app.use(displayTemplate)

app.use(function (req, res) {
  res.status(404).send('Not found!')
})

function displayConfiguration (req, res) {
  resources.retrieveAvailableResources(constants.resourcesPath, function (resources) {
    const config = fs.readJsonSync(constants.configPath)
    resources.map(function (resource) {
      var configItem = _.find(config, {resource: _.omit(resource, ['availableResponses'])})
      resource.selectedResponse = _.find(resource.availableResponses, {
        statusCode: configItem.response.statusCode,
        name: configItem.response.name
      })
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
      var matchingResponse = _.find(matchingResource.availableResponses, {
        statusCode: configItem.response.statusCode,
        name: configItem.response.name
      })
      if (matchingResponse) {
        res.status(matchingResponse.statusCode)
        res.render(matchingResponse.templatePath, matchingResponse.values)
        return
      }
    }
    next()
  })
}

function storeConfiguration (req, res) {
  var config = []
  _.forEach(req.body, function (value, key) {
    var resourceParameters = key.split('|')
    var resource = {
      requestPath: resourceParameters[0],
      httpMethod: resourceParameters[1],
      contentType: resourceParameters[2]
    }
    var responseParameters = value.split('|')
    var response = {
      statusCode: parseInt(responseParameters[0]),
      name: responseParameters[1]
    }
    config.push({
      resource: resource,
      response: response
    })
  })
  fs.writeJsonSync(constants.configPath, config)
  res.send('Gespeichert!')
}
