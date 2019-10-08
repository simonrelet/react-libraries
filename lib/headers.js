'use strict'

const HEADER = 'THIS FILE WAS GENERATED'

function generateHeader(src) {
  return `<!--
  ${HEADER}!
  Don't make any changes in it, update ${src} instead.
  If you still need to make changes in this file, remove this header so it won't be overridden.
-->\n\n`
}

function hasHeader(content) {
  return new RegExp(`<!--\\s+${HEADER}`, 'g').test(content)
}

module.exports = { generateHeader, hasHeader }
