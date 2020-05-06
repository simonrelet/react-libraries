'use strict'

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const tempy = require('tempy')
const ourPackageJson = require('../../package.json')
const glob = require('../../lib/glob')
const { callScriptInFixture } = require('./scriptExecution')

const PACKAGE_NAME = ourPackageJson.name
const SCRIPT_NAME = Object.keys(ourPackageJson.bin)[0]

async function writeDefaultPackageJson(packageJsonPath, packageName) {
  const packageJson = await fs.readJson(packageJsonPath)

  packageJson.name = packageName

  packageJson.devDependencies = Object.assign({}, packageJson.devDependencies, {
    [PACKAGE_NAME]: 'latest',
  })

  packageJson.scripts = Object.assign({}, packageJson.scripts, {
    build: `${SCRIPT_NAME} build`,
    'bump-version': `${SCRIPT_NAME} bump-version`,
    clean: `${SCRIPT_NAME} clean`,
    readme: `${SCRIPT_NAME} readme`,
    test: `${SCRIPT_NAME} test`,
  })

  packageJson.license = 'UNLICENSED'

  await fs.writeJson(packageJsonPath, packageJson)
}

module.exports = class Fixture {
  constructor(fixturePath) {
    this.fixturePath = fixturePath
    this.name = path.basename(fixturePath)
    this.testDirectory = null

    this.setup = this.setup.bind(this)
    this.teardown = this.teardown.bind(this)
    this.runScript = this.runScript.bind(this)
    this.listFolderContent = this.listFolderContent.bind(this)
  }

  async setup() {
    await this.teardown()

    this.testDirectory = tempy.directory()

    await fs.copy(this.fixturePath, this.testDirectory)

    await writeDefaultPackageJson(
      path.join(this.testDirectory, 'package.json'),
      this.name
    )

    await execa('yarnpkg', ['install', '--enable-pnp', '--mutex', 'network'], {
      cwd: this.testDirectory,
    })

    await execa('yarnpkg', ['link', PACKAGE_NAME], { cwd: this.testDirectory })
  }

  async teardown() {
    if (this.testDirectory != null) {
      await fs.remove(this.testDirectory)
      this.testDirectory = null
    }
  }

  async runScript(script, args, options) {
    return await callScriptInFixture(this.testDirectory, script, args, options)
  }

  async listFolderContent(folder) {
    const absoluteFolder = path.join(this.testDirectory, folder)

    const filesPath = await glob(path.join(absoluteFolder, '**'), {
      nodir: true,
    })

    return filesPath.map((filePath) => path.relative(absoluteFolder, filePath))
  }
}
