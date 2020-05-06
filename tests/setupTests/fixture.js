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
    [PACKAGE_NAME]: `file:${path.resolve(__dirname, '../..')}`,
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
    this.fixtureName = path.basename(fixturePath)

    this.paths = {
      root: fixturePath,
      testDirectory: null,
      // packageJson: null,
      // packageLock: null,
      // changelog: null,
      // readme: null,
      // source: null,
      // output: null,
    }

    this.setup = this.setup.bind(this)
    this.teardown = this.teardown.bind(this)
    this.runScript = this.runScript.bind(this)
    this.listFolderContent = this.listFolderContent.bind(this)
  }

  async setup() {
    await this.teardown()

    this.paths.testDirectory = tempy.directory()

    // this.paths.packageJson = path.join(testDirectory, 'package.json')
    // this.paths.packageLock = path.join(testDirectory, 'package-lock.json')
    // this.paths.changelog = path.join(testDirectory, 'CHANGELOG.md')
    // this.paths.readme = path.join(testDirectory, 'README.md')
    // this.paths.source = path.join(testDirectory, 'src')
    // this.paths.output = path.join(testDirectory, 'build')

    await fs.copy(this.paths.root, this.paths.testDirectory)

    await writeDefaultPackageJson(
      path.join(this.paths.testDirectory, 'package.json'),
      this.fixtureName
    )

    await execa('yarnpkg', ['install', '--enable-pnp', '--mutex', 'network'], {
      cwd: this.paths.testDirectory,
    })
  }

  async teardown() {
    if (this.paths.testDirectory != null) {
      await fs.remove(this.paths.testDirectory)
      this.paths.testDirectory = null
    }
  }

  async runScript(script, args, options) {
    return await callScriptInFixture(
      this.paths.testDirectory,
      script,
      args,
      options
    )
  }

  async listFolderContent(folder) {
    const absoluteFolder = path.join(this.paths.testDirectory, folder)

    const filesPath = await glob(path.join(absoluteFolder, '**'), {
      nodir: true,
    })

    return filesPath.map((filePath) => path.relative(absoluteFolder, filePath))
  }
}
