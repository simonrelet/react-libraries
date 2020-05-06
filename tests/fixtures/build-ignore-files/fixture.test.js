'use strict'

const fixture = require('../../setupTests')

describe(`${fixture.name} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build', [
      '-i',
      'src/**/*.ignore.js',
    ])

    expect(result.exitCode).toEqual(0)
    expect(result.output).toMatchInlineSnapshot(`
      "$ react-libraries build -i 'src/**/*.ignore.js'
      CommonJS build successful.
      ES modules build successful."
    `)
  })

  it('should ignore files during build', async () => {
    expect(await fixture.listFolderContent('build')).toEqual([
      'cjs/aaa.js',
      'cjs/bbb.js',
      'cjs/ccc/ccc.js',
      'es/aaa.js',
      'es/bbb.js',
      'es/ccc/ccc.js',
    ])
  })
})
