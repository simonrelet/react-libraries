'use strict'

const execa = require('execa')
const { getBinPathSync } = require('get-bin-path')

const BIN_PATH = getBinPathSync()

const OBJECT_TYPE = Symbol.for('script-execution-result-serializer')

function createExecutionResult(exitCode, output) {
  return { $$type: OBJECT_TYPE, exitCode, output }
}

async function callScriptInPackage(packagePath, script, scriptsArgs = []) {
  try {
    const result = await execa.node(BIN_PATH, [script].concat(scriptsArgs), {
      cwd: packagePath,
      env: Object.assign({}, process.env, {
        // We don't want color codes in the snapshots.
        // https://github.com/chalk/chalk#chalksupportscolor
        FORCE_COLOR: false,
      }),

      // stdout and stderr interleaved.
      all: true,
    })

    return createExecutionResult(result.exitCode, result.all)
  } catch (error) {
    return createExecutionResult(error.exitCode, error.all)
  }
}

const ExecutionResultSnapshotSerializer = {
  test: (val) => val != null && val.$$type === OBJECT_TYPE,

  print: ({ exitCode, output }) => {
    return `Exit code: ${exitCode}\n\n--- Output ---\n${output}\n--------------`
  },
}

module.exports = { ExecutionResultSnapshotSerializer, callScriptInPackage }
