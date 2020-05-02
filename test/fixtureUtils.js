'use strict'

const fs = require('fs-extra')
const path = require('path')
const generatedFolders = require('../lib/generatedFolders')
const glob = require('../lib/glob')

async function listFolderContent(folder) {
  let filesPath = await glob(path.join(folder, '/**'), { nodir: true })
  return filesPath.map((filePath) => path.relative(folder, filePath))
}

async function cleanFixture(packagePath) {
  await Promise.all(
    generatedFolders.map((folder) => fs.remove(path.join(packagePath, folder)))
  )
}

const FILE_COMPILATION_OBJECT_TYPE = Symbol.for('file-compilation-serializer')

async function createFileCompilation(sourcePath, compiledPath) {
  const [source, compiled] = await Promise.all([
    fs.readFile(sourcePath, 'utf8'),
    fs.readFile(compiledPath, 'utf8'),
  ])

  return {
    $$type: FILE_COMPILATION_OBJECT_TYPE,
    fileName: path.basename(sourcePath),
    content: { source, compiled },
  }
}

const FileCompilationSnapshotSerializer = {
  test: (val) => val != null && val.$$type === FILE_COMPILATION_OBJECT_TYPE,

  print: ({ fileName, content }) => {
    return `// ${fileName}\n\n${content.source}\n\n        ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓\n\n\n${content.compiled}`
  },
}

async function getFixtureVersion(packagePath) {
  const packageJSONPath = path.join(packagePath, 'package.json')
  const packageJSON = await fs.readJSON(packageJSONPath)
  return packageJSON.version
}

async function setFixtureVersion(packagePath, version) {
  const packageJSONPath = path.join(packagePath, 'package.json')
  const packageJSON = await fs.readJSON(packageJSONPath)
  packageJSON.version = version

  await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
}

module.exports = {
  listFolderContent,
  cleanFixture,
  getFixtureVersion,
  setFixtureVersion,
  createFileCompilation,
  FileCompilationSnapshotSerializer,
}
