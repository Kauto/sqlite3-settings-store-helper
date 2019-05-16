const { describe } = require('mocha')
const DB = require('better-sqlite3-helper')
const DBoptions = {
  path: ':memory:',
  migrate: false
}
const settingsOptions = {
  default: require('./tests/default')
}

describe('better-sqlite3-helper - default settings - getset', require('./tests/getset')(settingsOptions, DB, DBoptions))
describe('better-sqlite3-helper - default settings - object', require('./tests/object')(settingsOptions, DB, DBoptions))
