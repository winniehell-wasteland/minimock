const mustacheExpress = require('mustache-express')
const packpath = require('packpath')
const path = require('path')

exports.configPath = path.join(packpath.self(), 'config.json')
exports.templatePath = path.join(packpath.self(), 'templates')
exports.viewPath = path.join(packpath.self(), 'views')

exports.templateEngine = mustacheExpress()
