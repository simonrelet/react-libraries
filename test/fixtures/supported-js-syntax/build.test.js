'use strict'

const path = require('path')
const { Fixture, createFileCompilation } = require('../../fixtureUtils')

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

  it('should generate all files', async () => {
    expect(await fixture.listFolderContent('build')).toMatchSnapshot()
  })

  it('should transform each file to CommonJS', async () => {
    const files = await fixture.listFolderContent('src')

    const filesCompilation = await Promise.all(
      files.map(async (file) =>
        createFileCompilation(
          path.join(fixture.paths.source, file),
          path.join(fixture.paths.commonJSOutput, file),
        ),
      ),
    )

    filesCompilation.forEach((fileCompilation) => {
      expect(fileCompilation).toMatchSnapshot()
    })
  })

  it('should transform each file to ES modules', async () => {
    const files = await fixture.listFolderContent('src')

    const filesCompilation = await Promise.all(
      files.map(async (file) =>
        createFileCompilation(
          path.join(fixture.paths.source, file),
          path.join(fixture.paths.esModuleOutput, file),
        ),
      ),
    )

    filesCompilation.forEach((fileCompilation) => {
      expect(fileCompilation).toMatchSnapshot()
    })
  })
})
