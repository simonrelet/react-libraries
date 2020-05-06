'use strict'

const path = require('path')
const Fixture = require('./fixture')

const fixturePath = path.dirname(module.parent.filename)
const fixture = new Fixture(fixturePath)

// 5 minutes
const JEST_TIMEOUT = 1000 * 60 * 5

beforeAll(async () => {
  await fixture.setup()
}, JEST_TIMEOUT)

afterAll(async () => {
  await fixture.teardown()
})

beforeEach(() => jest.setTimeout(JEST_TIMEOUT))

module.exports = fixture
