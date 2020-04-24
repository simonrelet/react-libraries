'use strict'

const autoprefixer = require('autoprefixer')
const babel = require('@babel/core')
const chalk = require('chalk')
const chokidar = require('chokidar')
const cssnano = require('cssnano')
const fs = require('fs-extra')
const globCB = require('glob')
const minimist = require('minimist')
const path = require('path')
const postcss = require('postcss')
const sass = require('node-sass')
const createBabelConfig = require('../config/createBabelConfig')
const logger = require('../lib/logger')

function getOutputFileName(outputFolder) {
  return (filename) => filename.replace(/^src/, outputFolder)
}

function ensureArray(object) {
  return Array.isArray(object) ? object : [object]
}

function glob(...args) {
  return new Promise((resolve, reject) => {
    globCB(...args, (error, files) => {
      if (error) {
        reject(error)
      } else {
        resolve(files)
      }
    })
  })
}

async function buildJS({ sourceFilesJS, modulesType, outputFolder }) {
  const presets = createBabelConfig({ modules: modulesType })
  const outputFilename = getOutputFileName(outputFolder)

  async function transformFile(filename) {
    const config = babel.loadPartialConfig(
      Object.assign(
        {
          filename,
          caller: {
            name: 'react-libraries',
            supportsStaticESM: true,
            supportsDynamicImport: true,
          },
        },
        presets
      )
    )

    if (config) {
      const { code } = await babel.transformFileAsync(filename, config.options)
      return await fs.outputFile(outputFilename(filename), code)
    }
  }

  return await Promise.all(sourceFilesJS.map(transformFile))
}

async function copyFiles(filesToCopy, outputFolder) {
  const outputFilename = getOutputFileName(outputFolder)

  async function copyFile(filename) {
    const destination = outputFilename(filename)
    await fs.ensureDir(path.dirname(destination))
    return await fs.copyFile(filename, destination)
  }

  return await Promise.all(filesToCopy.map(copyFile))
}

async function buildModule({
  sourceFilesJS,
  modulesType,
  outputFolder,
  filesToCopy,
  moduleName,
}) {
  try {
    await buildJS({ sourceFilesJS, modulesType, outputFolder })

    if (filesToCopy.length) {
      await copyFiles(filesToCopy, outputFolder)
    }

    logger.log(chalk.green(`${moduleName} build successful.`))
  } catch (error) {
    logger.error(
      `\n${error.message}\n`,
      chalk.red(`${moduleName} build failed.`)
    )
    throw error
  }
}

async function buildModules({ filesPatternsToCopy, ignoredFiles, pkg }) {
  async function getSources() {
    return await glob('src/**/*.js', { ignore: ignoredFiles })
  }

  async function getFilesToCopy() {
    const files = await Promise.all(
      filesPatternsToCopy.map((pattern) => glob(pattern))
    )

    return files.reduce((acc, files) => acc.concat(files), [])
  }

  const [sourceFilesJS, filesToCopy] = await Promise.all([
    getSources(),
    getFilesToCopy(),
  ])

  if (pkg.main) {
    await buildModule({
      sourceFilesJS,
      modulesType: 'commonjs',
      outputFolder: pkg.main,
      filesToCopy,
      moduleName: 'CommonJS',
    })
  }

  if (pkg.module) {
    await buildModule({
      sourceFilesJS,
      modulesType: 'es',
      outputFolder: pkg.module,
      filesToCopy,
      moduleName: 'ES modules',
    })
  }
}

async function safeBuildModules(...args) {
  try {
    await buildModules(...args)
  } catch (_) {}
}

function renderSASS(config) {
  return new Promise((resolve, reject) => {
    sass.render(config, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result.css.toString())
      }
    })
  })
}

async function renderPostCSS(css) {
  const result = await postcss([autoprefixer, cssnano]).process(css, {
    from: undefined,
  })
  return result.css
}

async function buildStyles({ sassInputFile, pkg }) {
  try {
    let css = await renderSASS({
      file: sassInputFile,
      includePaths: ['node_modules'],
    })
    css = await renderPostCSS(css)
    await fs.outputFile(pkg.style, css)
    logger.log(chalk.green('SASS build successful.'))
  } catch (error) {
    logger.error(`\n${error.message}\n`, chalk.red('SASS build failed.'))
    throw error
  }
}

async function safeBuildStyles(...args) {
  try {
    await buildStyles(...args)
  } catch (_) {}
}

async function build(args) {
  args = minimist(args, {
    alias: { copy: 'c', watch: 'w', ignore: 'i', sass: 's' },
    boolean: 'watch',
    string: ['copy', 'ignore', 'sass'],
  })

  let ignoredFiles = [
    '**/*.{spec,test,stories}.js',
    '**/__tests__/**',
    '**/__mocks__/**',
    '**/setupTests.js',
  ]

  if (args.ignore != null) {
    ignoredFiles = ignoredFiles.concat(ensureArray(args.ignore))
  }

  const sassInputFile = args.sass || './src/index.scss'
  const [hasSASS, pkg] = await Promise.all([
    fs.existsSync(sassInputFile),
    fs.readJSON('package.json'),
  ])

  if (!pkg.main) {
    throw new Error('No package.json#main key found.')
  }

  if (!pkg.style && hasSASS) {
    logger.warn(
      chalk.yellow(
        `The file ${sassInputFile} can only be built if a package.json#style key is specified.`
      )
    )
  }

  if (pkg.style && !hasSASS) {
    logger.warn(
      chalk.yellow(`No ${sassInputFile} file found to build to ${pkg.style}.`)
    )
  }

  const hasStyles = pkg.style && hasSASS
  const filesPatternsToCopy = args.copy == null ? [] : ensureArray(args.copy)

  const configJS = {
    filesPatternsToCopy,
    ignoredFiles,
    pkg,
  }

  const configStyles = {
    sassInputFile,
    pkg,
  }

  if (args.watch) {
    const watchOptions = { ignoreInitial: true }

    const runJS = () => safeBuildModules(configJS)
    chokidar.watch('src/**', watchOptions).on('all', runJS)
    runJS()

    if (hasStyles) {
      const runStyles = () => safeBuildStyles(configStyles)
      chokidar.watch('src/**/*.scss', watchOptions).on('all', runStyles)
      runStyles()
    }
  } else {
    buildModules(configJS)

    if (hasStyles) {
      buildStyles(configStyles)
    }
  }
}

module.exports = build
