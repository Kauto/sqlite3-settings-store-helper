const { describe } = require('mocha')
const DB = require('sqlite3-helper/no-generators')
const DBoptions = {
  path: ':memory:',
  migrate: false
}

describe('sqlite3-helper - no cache', require('./tests/getset')({ cache: false }, DB, DBoptions))
