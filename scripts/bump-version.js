'use strict'

const chalk = require('chalk')
const dateFns = require('date-fns')
const fs = require('fs-extra')
const minimist = require('minimist')
const semver = require('semver')
const logger = require('../lib/logger')
const generateReadme = require('../lib/generateReadme')

const changelogPath = 'CHANGELOG.md'

async function updatePackage(version, pkg) {
  pkg.version = version
  await fs.writeJSON('package.json', pkg, { spaces: 2 })
  logger.generated('package.json', 'package.json')

  if (await fs.exists('package-lock.json')) {
    const lock = await fs.readJSON('package-lock.json')
    lock.version = version
    await fs.writeJSON('package-lock.json', lock, { spaces: 2 })
    logger.generated('package-lock.json', 'package-lock.json')
  }
}

async function updateChangelog(version) {
  if (await fs.exists(changelogPath)) {
    const date = dateFns.format(new Date(), 'MMMM d, yyyy')
    const content = await fs.readFile(changelogPath, 'utf8')
    const changelog = content.replace(
      '## Unreleased',
      `## ${version} (${date})`
    )

    await fs.writeFile(changelogPath, changelog)
    logger.generated(changelogPath, changelogPath)
  }
}

async function bumpVersion(args) {
  args = minimist(args, {
    alias: { readme: 'r' },
    string: 'readme',
    boolean: 'skip-check',
  })

  const version = args._[0]
  const skipCheck = args['skip-check']

  if (!version) {
    throw new Error('Missing version number.')
  }

  const pkg = await fs.readJSON('package.json')

  if (!semver.valid(version)) {
    throw new Error(
      `The version ${chalk.cyan(version)}` +
        ` is not a valid semantic version number.`
    )
  }

  if (!skipCheck && semver.lte(version, pkg.version)) {
    throw new Error(
      `The version number must be bigger than the current one.\n` +
        `  Received: ${chalk.cyan(version)}\n` +
        `  Current:  ${chalk.cyan(pkg.version)}`
    )
  }

  await updatePackage(version, pkg)
  await updateChangelog(version)
  await generateReadme(args.readme)
}

module.exports = bumpVersion
