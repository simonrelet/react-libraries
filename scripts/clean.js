'use strict'

const chalk = require('chalk')
const fs = require('fs-extra')
const logger = require('../lib/logger')

const defaultFiles = ['build', 'build-storybook', 'coverage']

async function clean(args) {
  const files = defaultFiles.concat(args).filter(fs.existsSync)

  if (!files.length) {
    logger.log('Already clean.')
    return
  }

  await Promise.all(files.map(file => fs.remove(file)))

  const s = files.length > 1 ? 's' : ''
  const deletedFiles = files.map(f => chalk.red(f)).join(', ')
  logger.log(`Deleted file${s}: ${deletedFiles}.`)
}

module.exports = clean
