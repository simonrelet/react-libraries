'use strict'

const fs = require('fs-extra')
const get = require('lodash.get')
const logger = require('./logger')
const headers = require('./headers')
const canGenerateFile = require('./canGenerateFile')

const dst = 'README.md'
const defaultSRC = 'README-template.md'

async function generateReadme(src) {
  src = src || defaultSRC

  if ((await fs.exists(src)) && (await canGenerateFile(dst))) {
    const header = headers.generateHeader(src)
    const [pkg, content] = await Promise.all([
      fs.readJSON('package.json'),
      fs.readFile(src, 'utf8'),
    ])

    const readme = content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const escaped = path[0] === '!'
      const value = get(pkg, escaped ? path.substring(1) : path, null)

      // We only remove the `!` if the path exists in package.json.
      if (escaped && value != null) {
        return `{{${path.substring(1)}}}`
      }

      return value != null ? value : match
    })

    await fs.writeFile(dst, `${header}${readme}`)
    logger.generated(src, dst)
  }
}

module.exports = generateReadme
