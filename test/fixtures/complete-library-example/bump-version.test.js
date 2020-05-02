'use strict'

const fs = require('fs-extra')
const path = require('path')
const semver = require('semver')
const { getFixtureVersion, setFixtureVersion } = require('../../fixtureUtils')
const { callScriptInPackage } = require('../../scriptExecution')
const packageJSON = require('./package.json')

const CHANGELOG_PATH = path.join(__dirname, 'CHANGELOG.md')
// const README_PATH = path.join(__dirname, 'README.md')

describe(`${packageJSON.name} bump-version`, () => {
  let initialChangelogContent = ''
  let initialVersion = ''
  let version = ''

  beforeAll(async () => {
    initialVersion = await getFixtureVersion(__dirname)
    version = semver.inc(initialVersion, 'major')

    initialChangelogContent = await fs.readFile(CHANGELOG_PATH, 'utf8')
  })

  afterAll(async () => {
    await setFixtureVersion(__dirname, initialVersion)
    await fs.writeFile(CHANGELOG_PATH, initialChangelogContent)
  })

  it('should not fail', async () => {
    const result = await callScriptInPackage(__dirname, 'bump-version', [
      version,
    ])

    expect(result).toMatchSnapshot()
  })

  it('should bump the new version', async () => {
    const bumpedVersion = await getFixtureVersion(__dirname)
    expect(bumpedVersion).toEqual(version)
  })

  it('should update the Changelog', async () => {
    const changelogContent = await fs.readFile(CHANGELOG_PATH, 'utf8')
    expect(changelogContent).toMatch(new RegExp(`${version}`))
  })
})
