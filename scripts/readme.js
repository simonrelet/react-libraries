'use strict'

const minimist = require('minimist')
const generateReadme = require('../lib/generateReadme')

function readme(args) {
  args = minimist(args, {
    alias: { template: 't' },
    string: 'template',
  })

  generateReadme(args.template)
}

module.exports = readme
