const fs = require('fs-extra')

exports.list = listTemplates

const templateFilePattern = /^(.*\/)(get|post)\/(\d+)\.(json|xml)$/

function listTemplates (templatePath, callback) {
  var templateFiles = []
  fs.walk(templatePath)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        if (!item.stats.isFile()) {
          continue
        }

        const relativePath = item.path.replace(templatePath, '').substr(1)

        if (templateFilePattern.test(relativePath)) {
          const match = templateFilePattern.exec(relativePath)
          const templateFile = {
            filePath: relativePath,
            requestPath: '/' + match[1],
            method: match[2],
            statusCode: match[3],
            extension: match[4]
          }
          templateFiles.push(templateFile)
        }
      }
    })
    .on('end', function () {
      callback(templateFiles)
    })
}
