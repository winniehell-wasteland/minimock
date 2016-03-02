const mustacheExpress = require('mustache-express')
const packpath = require('packpath')
const path = require('path')

exports.configPath = path.join(packpath.self(), 'config.json')
exports.resourcesPath = path.join(packpath.self(), 'resources')
exports.viewPath = path.join(packpath.self(), 'views')

exports.templatePath = exports.resourcesPath

exports.templateEngine = mustacheExpress()

exports.templateFilePattern = /^(.*\/)(get|post)\/(\d+)\.(json|xml)$/
