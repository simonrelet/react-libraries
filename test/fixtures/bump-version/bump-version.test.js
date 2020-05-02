'use strict'

const fs = require('fs-extra')
const path = require('path')
const { callScriptInPackage } = require('../../scriptExecution')

const PACKAGE_JSON_PATH = path.join(__dirname, 'package.json')
const PACKAGE_JSON = {
  name: 'bump-version',
  version: '1.0.0',
  description: 'Description of the library.',
  repository: {
    url: 'https://repository.url',
  },
}

const NEW_VERSION = '2.0.0'

describe('bump-version', () => {
  // beforeEach(async () => {
  //   await fs.writeJSON(PACKAGE_JSON_PATH, PACKAGE_JSON, { spaces: 2 })
  // })
  // afterEach(async () => {
  //   await fs.remove(PACKAGE_JSON_PATH)
  // })
  // it('should not fail', async () => {
  //   const result = await callScriptInPackage(__dirname, 'bump-version', [
  //     NEW_VERSION,
  //   ])
  //   expect(result).toMatchSnapshot()
  // })
  // it('should bump the new version', async () => {
  //   const result = await callScriptInPackage(__dirname, 'bump-version', [
  //     version,
  //   ])
  //   expect(result).toMatchSnapshot()
  // })
})
