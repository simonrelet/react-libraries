'use strict'

const fixture = require('../../setupTests')

describe(`${fixture.fixtureName} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build', [
      '-i',
      'src/**/*.ignore.js',
    ])

    expect(result).toMatchSnapshot()
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
