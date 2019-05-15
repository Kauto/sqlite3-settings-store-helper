const { describe } = require('mocha')
const DB = require('better-sqlite3-helper')
const DBoptions = {
  path: ':memory:',
  migrate: false
}

describe('better-sqlite3-helper - no cache', require('./tests/getset')({ cache: false }, DB, DBoptions))
