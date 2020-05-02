'use strict'

const path = require('path')
const { cleanFixture, listFolderContent } = require('../../fixtureUtils')
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

  it('should generate all files', async () => {
    const files = await listFolderContent(path.join(__dirname, 'build'))
    expect(files).toMatchSnapshot()
  })
})
