'use strict'

const fs = require('fs-extra')
const path = require('path')

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

module.exports = { createFileCompilation, FileCompilationSnapshotSerializer }
