'use strict'

// Make sure the environment is set.
process.env.NODE_ENV = 'test'

const fs = require('fs-extra')
const jest = require('jest')
const createJestConfig = require('../config/createJestConfig')

async function test(args) {
  const pkg = await fs.readJSON('package.json')

  // Watch unless on CI, in coverage mode, or explicitly running all tests
  if (!process.env.CI && args.indexOf('--coverage') === -1) {
    args.push('--watch')
  }

  args.push('--config', JSON.stringify(createJestConfig(pkg.jest)))

  jest.run(args)
}

module.exports = test
