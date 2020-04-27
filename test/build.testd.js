'use strict'

const path = require('path')
const fs = require('fs-extra')
const { callScriptInPackage } = require('./scriptExecution')
const glob = require('../lib/glob')

const fixturesPath = path.resolve(__dirname, 'fixtures')
const fixturesName = fs.readdirSync(fixturesPath)

const packages = fixturesName.map((fixtureName) => ({
  path: path.resolve(fixturesPath, fixtureName),
  name: fixtureName,
  json: fs.readJSONSync(
    path.resolve(fixturesPath, fixtureName, 'package.json')
  ),
}))

function createFileTree(filesPath) {
  const tree = {
    $$type: Symbol.for('rl.fileTree'),
    file: 'build',
    children: {},
  }

  filesPath.forEach((filePath) => {
    addToTree(tree, filePath.split('/'))
  })

  return tree
}

function addToTree(parent, [file, ...rest]) {
  let node = parent.children[file]

  if (node == null) {
    parent.children[file] = { file, children: {} }
  }

  if (rest.length > 0) {
    addToTree(node, rest)
  }
}

async function getBuildTree(pkg) {
  let filesPath = await glob(path.resolve(pkg.path, 'build/**'))

  // Remove the _build_ folder, we only keep its content.
  filesPath = filesPath.slice(1)

  filesPath = filesPath.map((filePath) =>
    path.relative(path.resolve(pkg.path, 'build'), filePath)
  )
  return createFileTree(filesPath)
}

describe('react-libraries build', () => {
  packages.forEach((pkg) => {
    it(`should build all files in ${pkg.name}`, async () => {
      expect.assertions(2)
      const result = await callScriptInPackage(pkg.path, pkg.json, 'build')
      expect(result).toMatchSnapshot()

      const buildTree = await getBuildTree(pkg)
      expect(buildTree).toMatchSnapshot()
    })
  })
})
