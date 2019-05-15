const { describe } = require('mocha')
const DB = require('sqlite3-helper/no-generators')
const DBoptions = {
  path: ':memory:',
  migrate: false
}

describe('sqlite3-helper - default settings', require('./tests/getset')({}, DB, DBoptions))
