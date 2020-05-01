'use strict'

const fs = require('fs-extra')
const path = require('path')
const { cleanFixture } = require('../../fixtureContent')
const { callScriptInPackage } = require('../../scriptExecution')
const packageJSON = require('./package.json')

describe(`${packageJSON.name} build`, () => {
  beforeAll(async () => {
    await cleanFixture(__dirname)
  })

  it('should not fail', async () => {
    const result = await callScriptInPackage(__dirname, 'build')
    expect(result).toMatchSnapshot()
  })

  it('should compile to CSS', async () => {
    const compiledCSS = await fs.readFile(
      path.resolve(__dirname, packageJSON.style),
      'utf8',
    )

    expect(compiledCSS).toMatchSnapshot()
  })
})
