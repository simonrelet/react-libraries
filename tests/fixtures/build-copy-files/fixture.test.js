'use strict'

const fixture = require('../../setupTests')

describe.only(`${fixture.name} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build', [
      '-c',
      'src/**/*.copy.json',
    ])

    expect(result.exitCode).toEqual(0)
    expect(result.output).toMatchInlineSnapshot(`
      "$ react-libraries build -c 'src/**/*.copy.json'
      CommonJS build successful.
      ES modules build successful."
    `)
  })

  it('should ignore files during build', async () => {
    expect(await fixture.listFolderContent('build')).toEqual([
      'cjs/aaa.js',
      'cjs/bbb.copy.json',
      'cjs/bbb.js',
      'cjs/ccc/ccc.copy.json',
      'cjs/ccc/ccc.js',
      'es/aaa.js',
      'es/bbb.copy.json',
      'es/bbb.js',
      'es/ccc/ccc.copy.json',
      'es/ccc/ccc.js',
    ])
  })
})
