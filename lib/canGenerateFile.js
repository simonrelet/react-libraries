'use strict'

const fs = require('fs-extra')
const headers = require('./headers')

async function canGenerateFile(file) {
  if (await fs.exists(file)) {
    const content = await fs.readFile(file, 'utf8')
    if (!headers.hasHeader(content)) {
      console.log(`Skiping manually written file: ${file}.`)
      return false
    }
  }

  return true
}

module.exports = canGenerateFile
