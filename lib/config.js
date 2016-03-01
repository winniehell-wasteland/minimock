const mustacheExpress = require('mustache-express')
const packpath = require('packpath')
const path = require('path')

exports.viewPath = path.join(packpath.self(), 'views')
exports.templatePath = path.join(packpath.self(), 'templates')

exports.templateEngine = mustacheExpress()
