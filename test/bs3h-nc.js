const { describe } = require('mocha')
const DB = require('better-sqlite3-helper')
const DBoptions = {
  path: ':memory:',
  migrate: false
}
const settingsOptions = {
  cache: false,
  default: require('./tests/default')

}

describe('better-sqlite3-helper - no cache - getset', require('./tests/getset')(settingsOptions, DB, DBoptions))
describe('better-sqlite3-helper - no cache - object', require('./tests/object')(settingsOptions, DB, DBoptions))
