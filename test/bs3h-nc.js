const { describe } = require('mocha')
const config = require('./tests/config')
const DB = require('better-sqlite3-helper')
const DBoptions = {
  path: ':memory:',
  migrate: false
}
const settingsOptions = {
  cache: false,
  default: config.default
}

for (const test of config.tests) {
  describe(`better-sqlite3-helper - no cache - ${test}`, require(`./tests/${test}`)(settingsOptions, DB, DBoptions))
}
