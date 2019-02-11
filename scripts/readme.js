'use strict'

const minimist = require('minimist')
const generateReadme = require('../lib/generateReadme')

async function readme(args) {
  args = minimist(args, {
    alias: { template: 't' },
    string: 'template',
  })

  await generateReadme(args.template)
}

module.exports = readme
