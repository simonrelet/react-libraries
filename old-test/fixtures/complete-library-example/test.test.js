'use strict'

const path = require('path')
const { Fixture } = require('../../fixtureUtils')

describe(`${path.basename(__dirname)} test`, () => {
  let fixture

  beforeAll(async () => {
    fixture = new Fixture(__dirname)
    await fixture.initialize()
  })

  afterAll(async () => {
    await fixture.reset()
  })

  it('should not fail', async () => {
    expect(
      await fixture.runScript('test', ['--coverage'], { env: { CI: true } }),
    ).toMatchSnapshot()
  })

  // it('should generate all files', async () => {
  //   expect(await fixture.listFolderContent('build')).toMatchSnapshot()
  // })
})
