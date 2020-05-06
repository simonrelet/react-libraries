'use strict'

module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.fixture.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests/setupJest.js'],
}
