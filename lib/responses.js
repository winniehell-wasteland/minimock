'use strict'

const path = require('path')
const fs = require('fs-extra')

class Response {
  constructor (name, statusCode, templatePath, values) {
    this.name = name
    this.statusCode = statusCode
    this.templatePath = templatePath
    this.values = values
  }
}

function retrieveAvailableResponses (resourcePath, resource, statusCode) {
  var responses = []
  var responsesDir = path.join(
    resourcePath,
    resource.requestPath,
    resource.httpMethod,
    statusCode.toString()
  )

  var responseFiles = fs.readdirSync(responsesDir)
  for (var responseFile of responseFiles) {
    var templatePath = path.join(
      resourcePath,
      resource.requestPath,
      resource.httpMethod,
      statusCode + '.' + resource.contentType
    )
    var values = fs.readJsonSync(path.join(responsesDir, responseFile))
    var response = new Response(responseFile.replace(/\.json$/, ''), statusCode, templatePath, values)
    responses.push(response)
  }

  return responses
}

exports.Response = Response
exports.retrieveAvailableResponses = retrieveAvailableResponses
