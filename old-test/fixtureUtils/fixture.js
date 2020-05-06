'use strict'

const fs = require('fs-extra')
const path = require('path')
const glob = require('../../lib/glob')
const { callScriptInFixture } = require('./scriptExecution')

class Fixture {
  constructor(rootPath) {
    this.paths = {
      root: rootPath,
      packageJSON: path.join(rootPath, 'package.json'),
      packageLock: path.join(rootPath, 'package-lock.json'),
      changelog: path.join(rootPath, 'CHANGELOG.md'),
      readme: path.join(rootPath, 'README.md'),
      source: path.join(rootPath, 'src'),
      output: path.join(rootPath, 'build'),
      commonJSOutput: null,
      esModuleOutput: null,
      styleOutput: null,
    }

    this._contents = {
      packageJSON: null,
      changelog: null,
      packageLock: null,
    }

    this._hasRun = {
      build: false,
      'bump-version': false,
    }

    this._hasGeneratedReadme = true
  }

  async initialize() {
    this._contents.packageJSON = await fs.readJSON(this.paths.packageJSON)

    this.paths.commonJSOutput = path.join(
      this.paths.root,
      this._contents.packageJSON.main
    )

    if (this._contents.packageJSON.module != null) {
      this.paths.esModuleOutput = path.join(
        this.paths.root,
        this._contents.packageJSON.module
      )
    }

    if (this._contents.packageJSON.style != null) {
      this.paths.styleOutput = path.join(
        this.paths.root,
        this._contents.packageJSON.style
      )
    }

    if (await fs.exists(this.paths.packageLock)) {
      this._contents.packageLock = await fs.readJSON(this.paths.packageLock)
    }

    if (await fs.exists(this.paths.changelog)) {
      this._contents.changelog = await fs.readFile(this.paths.changelog, 'utf8')
    }

    this._hasGeneratedReadme = !(await fs.exists(this.paths.readme))
  }

  async reset() {
    if (this._hasRun['bump-version']) {
      await fs.writeJSON(this.paths.packageJSON, this._contents.packageJSON, {
        spaces: 2,
      })

      if (this._contents.packageLock != null) {
        await fs.writeJSON(this.paths.packageLock, this._contents.packageLock, {
          spaces: 2,
        })
      }

      if (this._contents.changelog != null) {
        await fs.writeFile(this.paths.changelog, this._contents.changelog)
      }

      if (this._hasGeneratedReadme) {
        await fs.remove(this.paths.readme)
      }
    }

    if (this._hasRun['build']) {
      await fs.remove(this.paths.output)
    }
  }

  async listFolderContent(folder) {
    const absoluteFolder = path.join(this.paths.root, folder)

    const filesPath = await glob(path.join(absoluteFolder, '**'), {
      nodir: true,
    })

    return filesPath.map((filePath) => path.relative(absoluteFolder, filePath))
  }

  async runScript(script, args, options) {
    this._hasRun[script] = true
    return await callScriptInFixture(this.paths.root, script, args, options)
  }
}

module.exports = Fixture
