'use strict'

const fs = require('fs-extra')
const path = require('path')
const fixture = require('../../setupTests')

describe(`${fixture.name} bump-version`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('bump-version', ['2.0.0'])

    expect(result.exitCode).toEqual(0)
    expect(result.output).toMatchInlineSnapshot(`
      "$ react-libraries bump-version 2.0.0
      package.json -> package.json
      package-lock.json -> package-lock.json
      CHANGELOG.md -> CHANGELOG.md
      README-template.md -> README.md"
    `)
  })

  it('should update the package.json', async () => {
    const packageJson = await fs.readJSON(
      path.join(fixture.testDirectory, 'package.json')
    )

    expect(packageJson.version).toEqual('2.0.0')
  })

  it('should update the package-lock', async () => {
    const packageLock = await fs.readJSON(
      path.join(fixture.testDirectory, 'package-lock.json')
    )

    expect(packageLock.version).toEqual('2.0.0')
  })

  it('should update the Changelog', async () => {
    const changelog = await fs.readFile(
      path.join(fixture.testDirectory, 'CHANGELOG.md'),
      'utf8'
    )

    expect(changelog).toMatch(/^## 2\.0\.0/m)
  })

  it('should update the Readme', async () => {
    const readme = await fs.readFile(
      path.join(fixture.testDirectory, 'README.md'),
      'utf8'
    )

    expect(readme).toMatchInlineSnapshot(`
      "<!--
        THIS FILE WAS GENERATED!
        Don't make any changes in it, update README-template.md instead.
        If you still need to make changes in this file, remove this header so it won't be overridden.
      -->

      Version 2.0.0
      "
    `)
  })
})
