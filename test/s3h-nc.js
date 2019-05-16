const { describe } = require('mocha')
const DB = require('sqlite3-helper/no-generators')
const DBoptions = {
  path: ':memory:',
  migrate: false
}
const settingsOptions = {
  cache: false,
  default: require('./tests/default')

}

describe('sqlite3-helper - no cache - getset', require('./tests/getset')(settingsOptions, DB, DBoptions))
describe('sqlite3-helper - no cache - object', require('./tests/object')(settingsOptions, DB, DBoptions))
