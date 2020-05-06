'use strict'

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
    const result = await fixture.runScript('build', [
      '-i',
      'src/**/*.test.js',
      '-c',
      'src/**/*.d.ts',
    ])

    expect(result).toMatchSnapshot()
  })

  it('should generate all files', async () => {
    expect(await fixture.listFolderContent('build')).toMatchSnapshot()
  })
})
