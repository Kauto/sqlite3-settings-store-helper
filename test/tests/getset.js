const { it, afterEach, beforeEach } = require('mocha')
const { expect } = require('chai')
const Settings = require('../../src/settings')
const fs = require('fs')
const path = require('path')
const appRoot = require('app-root-path').path

module.exports = function (options, DB, DBOptions) {
  let settings = null
  let db = null
  return function () {
    beforeEach(async () => {
      db = new DB(DBOptions)
      settings = new Settings(Object.assign({}, options, { db }))
    })
    afterEach(async () => {
      settings = null
      await db.close()
      try {
        fs.unlinkSync(path.resolve(appRoot, './data/sqlite3.db'))
        fs.rmdirSync(path.resolve(appRoot, './data'))
      } catch (e) {}
    })

    it('should set a string and get a string', async function () {
      await settings.set('testvalue', 'test')
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.have.string('test')
    })

    it('should get undefined/default value if unknown', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.be.undefined
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue', 'test124')).to.have.string('test124')
    })
  }
}
