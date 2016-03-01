const packpath = require('packpath')
const path = require('path')

exports.viewPath = path.join(packpath.self(), 'views')
exports.templatePath = path.join(packpath.self(), 'templates')
