'use strict'

const _ = require('lodash')
const accept = require('accept')
const constants = require('./constants')
const fs = require('fs-extra')
const responses = require('./responses')

class Resource {
  constructor (requestPath, httpMethod, contentType) {
    this.requestPath = requestPath
    this.httpMethod = httpMethod
    this.contentType = contentType
  }

  isMatchingRequest (request) {
    if (request.method.toLowerCase() !== this.httpMethod.toLowerCase()) {
      return false
    }

    if (request.path !== this.requestPath) {
      return false
    }

    for (var mimeType of accept.mediaTypes(request.headers.accept)) {
      var isMimeTypeSupported = mimeType.endsWith('*') ||
        mimeType.endsWith('/' + this.contentType) ||
        mimeType.endsWith('+' + this.contentType)

      if (isMimeTypeSupported) {
        return true
      }
    }

    return false
  }
}

function retrieveAvailableResources (resourcePath, callback) {
  var resources = []
  fs.walk(resourcePath)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        if (!item.stats.isFile()) {
          continue
        }

        var relativePath = item.path.replace(resourcePath, '')

        if (constants.templateFilePattern.test(relativePath)) {
          var templateMatch = constants.templateFilePattern.exec(relativePath)
          var resource = new Resource(templateMatch[1], templateMatch[2], templateMatch[4])

          // avoid duplicates
          var sameResource = _.find(resources, resource)
          if (sameResource) {
            resource = sameResource
          } else {
            resources.push(resource)
            resource.availableResponses = []
          }

          var statusCode = parseInt(templateMatch[3])
          resource.availableResponses = _.union(
            resource.availableResponses,
            responses.retrieveAvailableResponses(resourcePath, resource, statusCode)
          )
        }
      }
    })
    .on('end', function () {
      callback(resources)
    })
}

exports.Resource = Resource
exports.retrieveAvailableResources = retrieveAvailableResources
