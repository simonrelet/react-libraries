'use strict'

const fs = require('fs-extra')
const path = require('path')
const { Fixture } = require('../../fixtureUtils')

describe(`${path.basename(__dirname)} readme`, () => {
  let fixture

  beforeAll(async () => {
    fixture = new Fixture(__dirname)
    await fixture.initialize()
  })

  afterAll(async () => {
    await fixture.reset()
  })

  it('should not fail', async () => {
    expect(await fixture.runScript('readme')).toMatchSnapshot()
  })

  it('should generate README', async () => {
    expect(await fs.readFile(fixture.paths.readme, 'utf8')).toMatchSnapshot()
  })
})
