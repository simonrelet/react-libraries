'use strict'

const globCB = require('glob')

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

module.exports = glob
