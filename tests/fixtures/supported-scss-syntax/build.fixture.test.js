'use strict'

const fs = require('fs-extra')
const path = require('path')
const fixture = require('../../setupTests')
const packageJson = require('./package.json')

describe(`${fixture.fixtureName} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build')
    expect(result).toMatchSnapshot()
  })

  it('should compile to CSS', async () => {
    const compiledCSS = await fs.readFile(
      path.resolve(fixture.paths.testDirectory, packageJson.style),
      'utf8'
    )

    expect(compiledCSS).toMatchSnapshot()
  })
})
