'use strict'

const execa = require('execa')
const stripAnsi = require('strip-ansi')

function createExecutionResult(exitCode, output) {
  return { exitCode, output: stripAnsi(output) }
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
      env: Object.assign({}, process.env, env),

      // stdout and stderr interleaved.
      all: true,
    })

    return createExecutionResult(result.exitCode, result.all)
  } catch (error) {
    return createExecutionResult(error.exitCode, error.all)
  }
}

module.exports = { callScriptInFixture }
