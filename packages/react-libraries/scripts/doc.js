'use strict';

const glob = require('glob');
const reactDocs = require('react-docgen');
const fs = require('fs-extra');
const path = require('path');
const jsdoc = require('jsdoc-api');
const formatReactComponentDoc = require('../lib/formatReactComponentDoc');
const formatJSDoc = require('../lib/formatJSDoc');
const generateReadme = require('../lib/generateReadme');
const logger = require('../lib/logger');
const headers = require('../lib/headers');
const canGenerateFile = require('../lib/canGenerateFile');

const sources = 'src/**/*.js';
const outputFolder = 'docs';
const files = glob.sync(sources, {
  ignore: ['**/index.js', '**/*.stories.js', '**/*.test.js'],
});

function parse(src) {
  try {
    const info = reactDocs.parse(src);
    return formatReactComponentDoc(info);
  } catch (_) {
    // Try to parse regular JavaScript file.
    const info = jsdoc.explainSync({ source: src });
    return formatJSDoc(info);
  }
}

function doc(args) {
  const readmeInput =
    args[0] === '--readme' || args[0] === '-r' ? args[1] : undefined;

  files.forEach(file => {
    const src = fs.readFileSync(file, 'utf8');
    const content = parse(src);

    if (content) {
      const name = path.basename(file, '.js');
      const outputFile = path.join(outputFolder, `${name}.md`);

      if (canGenerateFile(outputFile)) {
        const header = headers.generateHeader(file);
        fs.outputFileSync(outputFile, `${header}${content}\n`);
        logger.generated(file, outputFile);
      }
    }
  });

  generateReadme(readmeInput);
}

module.exports = doc;
