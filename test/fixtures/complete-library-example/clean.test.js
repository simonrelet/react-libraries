'use strict'

const fs = require('fs-extra')
const path = require('path')
const generatedFolders = require('../../../lib/generatedFolders')
const { Fixture } = require('../../fixtureUtils')

const TEST_FOLDERS = generatedFolders.concat(['custom-folder'])

describe(`${path.basename(__dirname)} clean`, () => {
  let fixture

  beforeAll(async () => {
    fixture = new Fixture(__dirname)
    await fixture.initialize()

    const foldersPath = TEST_FOLDERS.map((folder) =>
      path.join(fixture.paths.root, folder),
    )

    await Promise.all(foldersPath.map((folderPath) => fs.ensureDir(folderPath)))
  })

  afterAll(async () => {
    await fixture.reset()
  })

  it('should not fail', async () => {
    expect(
      await fixture.runScript('clean', ['custom-folder']),
    ).toMatchSnapshot()
  })

  TEST_FOLDERS.forEach((testFolder) => {
    it(`should remove folder: "${testFolder}"`, async () => {
      expect(await fs.exists(path.join(fixture.paths.root, testFolder))).toBe(
        false,
      )
    })
  })
})
