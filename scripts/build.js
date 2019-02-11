'use strict'

const autoprefixer = require('autoprefixer')
const babel = require('@babel/core')
const chalk = require('chalk')
const chokidar = require('chokidar')
const cssnano = require('cssnano')
const fs = require('fs-extra')
const globCB = require('glob')
const minimist = require('minimist')
const sass = require('node-sass')
const postcss = require('postcss')
const createBabelConfig = require('../config/createBabelConfig')
const logger = require('../lib/logger')

function getOutputFileName(outputFolder) {
  return filename => filename.replace(/^src/, outputFolder)
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
    return await fs.copyFile(filename, outputFilename(filename))
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

async function buildModules({ sourceFilesJS, filesToCopy, pkg }) {
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

  let filesToCopy = []
  if (args.copy != null) {
    filesToCopy = (await Promise.all(
      ensureArray(args.copy).map(pattern => glob(pattern))
    )).reduce((acc, files) => acc.concat(files), [])
  }

  const sassInputFile = args.sass || './src/index.scss'
  const [hasSASS, pkg] = await Promise.all([
    fs.existsSync(sassInputFile),
    fs.readJSON('package.json'),
  ])

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
  const sourceFilesJS = await glob('src/**/*.js', { ignore: ignoredFiles })

  if (args.watch) {
    const watchOptions = { ignoreInitial: true }
    const jsWatcher = chokidar.watch('src/**', watchOptions)
    jsWatcher.on('all', () => safeBuildModules(sourceFilesJS, filesToCopy))
    safeBuildModules(sourceFilesJS, filesToCopy)

    if (hasStyles) {
      const styleWatcher = chokidar.watch('src/**/*.scss', watchOptions)
      styleWatcher.on('all', () => safeBuildStyles(sassInputFile))
      safeBuildStyles({ sassInputFile, pkg })
    }
  } else {
    buildModules({ sourceFilesJS, filesToCopy, pkg })

    if (hasStyles) {
      buildStyles({ sassInputFile, pkg })
    }
  }
}

module.exports = build
