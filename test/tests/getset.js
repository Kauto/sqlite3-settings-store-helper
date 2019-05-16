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
      db = null
      try {
        fs.unlinkSync(path.resolve(appRoot, './data/sqlite3.db'))
        fs.rmdirSync(path.resolve(appRoot, './data'))
      } catch (e) {}
    })

    it('should set a string and get a string', async function () {
      await settings.set('testvalue', 'test447')
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.have.string('test447')
    })

    it('should set a string and get a string later from database', async function () {
      await settings.set('testvalue', 'test447')

      settings = new Settings(Object.assign({}, options, { db }))
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.have.string('test447')
    })

    it('should set a number and get a number', async function () {
      await settings.set('testvalue', 31)
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.equal(31)
    })

    it('should set a number and get a number later from database', async function () {
      await settings.set('testvalue', 31)

      settings = new Settings(Object.assign({}, options, { db }))
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.equal(31)
    })

    it('should set a bool and get a bool', async function () {
      await settings.set('testvalue', true)
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.equal(true)
    })

    it('should set a bool and get a bool later from database', async function () {
      await settings.set('testvalue', true)

      settings = new Settings(Object.assign({}, options, { db }))
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.equal(true)
    })

    it('should get undefined/default value if unknown', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.be.undefined
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue', 'test124')).to.have.string('test124')
    })
  }
}
