'use strict'

const path = require('path')
const {
  cleanFixture,
  listFolderContent,
  createFileCompilation,
} = require('../../fixtureUtils')
const { callScriptInPackage } = require('../../scriptExecution')
const packageJSON = require('./package.json')

const MODULES = [
  { name: 'CommonJS', folder: 'cjs' },
  { name: 'ES module', folder: 'es' },
]

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

  MODULES.forEach(({ name, folder }) => {
    it(`should transform each file to ${name}`, async () => {
      const files = await listFolderContent(path.join(__dirname, 'src'))

      const filesCompilation = await Promise.all(
        files.map(async (file) =>
          createFileCompilation(
            path.join(__dirname, 'src', file),
            path.join(__dirname, 'build', folder, file),
          ),
        ),
      )

      filesCompilation.forEach((fileCompilation) => {
        expect(fileCompilation).toMatchSnapshot()
      })
    })
  })
})
