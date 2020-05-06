'use strict'

const fixture = require('../../setupTests')

describe(`${fixture.fixtureName} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build', [
      '-c',
      'src/**/*.copy.json',
    ])

    expect(result).toMatchSnapshot()
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
