const { describe, it, afterEach } = require('mocha')
const { expect } = require('chai')
const Settings = require('../src/settings')
const fs = require('fs')
const path = require('path')
const appRoot = require('app-root-path').path
const DB = require('sqlite3-helper/no-generators')
DB({
  migrate: false
})
let settings = null

describe('Settings Basics', function () {
  afterEach(async () => {
    settings = null
    await DB().close()
    try {
      fs.unlinkSync(path.resolve(appRoot, './data/sqlite3.db'))
      fs.rmdirSync(path.resolve(appRoot, './data'))
    } catch (e) {}
  })

  it('should set a string and get a string', async function () {
    settings = new Settings()

    await settings.set('testvalue', 'test')
    // eslint-disable-next-line no-unused-expressions
    expect(await settings.get('testvalue')).to.have.string('test')
  })

  it('should get undefined/default value if unknown', async function () {
    settings = new Settings()

    // eslint-disable-next-line no-unused-expressions
    expect(await settings.get('testvalue')).to.be.undefined
    // eslint-disable-next-line no-unused-expressions
    expect(await settings.get('testvalue', 'test124')).to.have.string('test124')
  })
})
