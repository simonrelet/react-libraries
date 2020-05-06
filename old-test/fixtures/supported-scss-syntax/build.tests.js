'use strict'

const fs = require('fs-extra')
const path = require('path')
const { loadFixture } = require('../../fixtureUtils')
const packageJSON = require('./package.json')

describe(`${packageJSON.name} build`, () => {
  let fixture

  beforeAll(async () => {
    fixture = await loadFixture(__dirname)
  })

  afterAll(async () => {
    await fixture.reset()
  })

  it('should not fail', async () => {
    expect(await fixture.run('build')).toMatchSnapshot()
  })

  it('should compile to CSS', async () => {
    const compiledCSS = await fs.readFile(
      path.resolve(__dirname, packageJSON.style),
      'utf8',
    )

    expect(compiledCSS).toMatchSnapshot()
  })
})
