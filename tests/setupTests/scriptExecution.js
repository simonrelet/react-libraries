'use strict'

const execa = require('execa')
const stripAnsi = require('strip-ansi')

const OBJECT_TYPE = Symbol.for('script-execution-result-serializer')

function createExecutionResult(exitCode, output) {
  return { $$type: OBJECT_TYPE, exitCode, output }
}

async function callScriptInFixture(
  fixturePath,
  script,
  scriptArgs = [],
  { env = {} } = {}
) {
  try {
    const result = await execa('yarnpkg', [script].concat(scriptArgs), {
      cwd: fixturePath,
      env: Object.assign({}, process.env, {
        // We don't want color codes in the snapshots.
        // https://github.com/chalk/chalk#chalksupportscolor
        FORCE_COLOR: false,
        ...env,
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
    return `Exit code: ${exitCode}\n\n--- Output ---\n${stripAnsi(
      output
    )}\n--------------`
  },
}

module.exports = { ExecutionResultSnapshotSerializer, callScriptInFixture }
