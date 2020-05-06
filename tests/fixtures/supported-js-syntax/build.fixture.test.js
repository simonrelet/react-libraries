'use strict'

const fixture = require('../../setupTests')

describe(`${fixture.fixtureName} build`, () => {
  it('should not fail', async () => {
    const result = await fixture.runScript('build')
    expect(result).toMatchSnapshot()
  })

  it('should generate all files', async () => {
    expect(await fixture.listFolderContent('build')).toEqual([
      'cjs/async.js',
      'cjs/ClassComponent.js',
      'cjs/DefaultExport.js',
      'cjs/DynamicImport/DynamicImport.js',
      'cjs/DynamicImport/LazyComponent.js',
      'cjs/FunctionComponent.js',
      'cjs/nullishCoalescing.js',
      'cjs/optionalChaining.js',
      'es/async.js',
      'es/ClassComponent.js',
      'es/DefaultExport.js',
      'es/DynamicImport/DynamicImport.js',
      'es/DynamicImport/LazyComponent.js',
      'es/FunctionComponent.js',
      'es/nullishCoalescing.js',
      'es/optionalChaining.js',
    ])
  })
})
