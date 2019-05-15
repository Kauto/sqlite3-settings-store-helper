const { describe } = require('mocha')
const DB = require('better-sqlite3-helper')
const DBoptions = {
  path: ':memory:',
  migrate: false
}

describe('better-sqlite3-helper - default settings', require('./tests/getset')({}, DB, DBoptions))
