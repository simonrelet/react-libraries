'use strict'

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    // Support fixture.test.js and prefix.fixture.test.js
    '<rootDir>/tests/**/?(*.)fixture.test.js',
  ],
}
