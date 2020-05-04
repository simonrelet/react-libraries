'use strict'

const fs = require('fs-extra')
const path = require('path')
const { Fixture } = require('../../fixtureUtils')

describe(`${path.basename(__dirname)} build`, () => {
  let fixture

  beforeAll(async () => {
    fixture = new Fixture(__dirname)
    await fixture.initialize()
  })

  afterAll(async () => {
    await fixture.reset()
  })

  it('should not fail', async () => {
    const result = await fixture.runScript('build')
    expect(result).toMatchSnapshot()
  })

  it('should compile to CSS', async () => {
    const compiledCSS = await fs.readFile(fixture.paths.styleOutput, 'utf8')
    expect(compiledCSS).toMatchSnapshot()
  })
})
