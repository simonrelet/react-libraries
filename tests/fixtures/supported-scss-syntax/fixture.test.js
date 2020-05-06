'use strict'

const fs = require('fs-extra')
const path = require('path')
const fixture = require('../../setupTests')
const packageJson = require('./package.json')

describe(`${fixture.name} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build')

    expect(result.exitCode).toEqual(0)
    expect(result.output).toMatchInlineSnapshot(`
      "$ react-libraries build
      CommonJS build successful.
      SASS build successful."
    `)
  })

  it('should compile to CSS', async () => {
    const compiledCSS = await fs.readFile(
      path.resolve(fixture.testDirectory, packageJson.style),
      'utf8'
    )

    expect(compiledCSS).toMatchInlineSnapshot(
      `".simple-class{background:red}.simple-class:before{background:#000}.nested-selectors,.simple-class:hover{background:green}.nested-selectors:focus{background:#000}.nested-selectors--modifier{background:#ff0}.nested-selectors:after{background:purple}.with-mixin-1{background:#00f;color:#000}.with-mixin-2{background:#00f;color:#fff}.with-placeholder-1,.with-placeholder-2{background:green}.with-placeholder-1{color:#000}.with-placeholder-2{color:#fff}"`
    )
  })
})
