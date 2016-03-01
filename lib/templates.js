const fs = require('fs-extra')

exports.list = listTemplates

function listTemplates (templatePath, callback) {
  var templateFiles = []
  fs.walk(templatePath)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        if (item.stats.isFile()) {
          const templateFile = {
            path: item.path.replace(templatePath, '')
          }
          templateFiles.push(templateFile)
        }
      }
    })
    .on('end', function () {
      callback(templateFiles)
    })
}
