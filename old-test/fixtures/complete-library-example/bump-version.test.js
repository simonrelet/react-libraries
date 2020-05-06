'use strict'

const fs = require('fs-extra')
const path = require('path')
const semver = require('semver')
const { Fixture } = require('../../fixtureUtils')

describe(`${path.basename(__dirname)} bump-version`, () => {
  let fixture
  let newVersion

  beforeAll(async () => {
    fixture = new Fixture(__dirname)
    await fixture.initialize()

    const packageJSON = await fs.readJSON(fixture.paths.packageJSON)
    newVersion = semver.inc(packageJSON.version, 'major')
  })

  afterAll(async () => {
    await fixture.reset()
  })

  it('should not fail', async () => {
    const result = await fixture.runScript('bump-version', [newVersion])
    expect(result).toMatchSnapshot()
  })

  it('should bump the new version', async () => {
    const packageJSON = await fs.readJSON(fixture.paths.packageJSON)
    expect(packageJSON.version).toEqual(newVersion)
  })

  it('should update the package-lock', async () => {
    const packageLock = await fs.readJSON(fixture.paths.packageLock)
    expect(packageLock.version).toEqual(newVersion)
  })

  it('should update the Changelog', async () => {
    const changelogContent = await fs.readFile(fixture.paths.changelog, 'utf8')
    expect(changelogContent).toMatch(new RegExp(`${newVersion}`))
  })

  it('should update the Readme', async () => {
    const readmeContent = await fs.readFile(fixture.paths.readme, 'utf8')
    expect(readmeContent).toMatch(new RegExp(`${newVersion}`))
  })
})
