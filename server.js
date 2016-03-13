const _ = require('lodash')
const fs = require('fs-extra')
const handlebars = require('handlebars')
const packpath = require('packpath')
const path = require('path')

const templatePath = path.join(packpath.self(), 'templates')

const users = [
  'alice',
  'john-doe'
]

const shoppingCartTemplate = loadTemplate('shopping-cart.xml.hbs')

_.forEach(users, (userName) => {
  var userPartial = loadTemplate(path.join('user', userName + '.xml.hbs'))
  handlebars.registerPartial(_.zipObject([userName], [userPartial]))

  var renderedTemplate = shoppingCartTemplate({
    userPartial: userName
  })
  fs.outputFileSync(path.join('out', userName + '.xml'), renderedTemplate)
})

function loadTemplate (fileName) {
  var fileContent = fs.readFileSync(path.join(templatePath, fileName), 'utf8')
  var template = handlebars.compile(fileContent)
  return template
}
