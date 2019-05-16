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

    it('should get the full objectPathList of the default values', async function () {
      expect(await settings.getObjectPathList()).to.deep.equal([['a.b', 'c'], ['d.e.f', 'g']])
    })

    it('should get the full objectPathList after getting and setting', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.be.undefined

      await settings.set('testvalue', { r: 'fe' })
      expect(await settings.get('testvalue')).to.deep.equal({ r: 'fe' })

      settings = new Settings(Object.assign({}, options, { db }))
      expect(await settings.getObjectPathList()).to.deep.equal([['a.b', 'c'], ['d.e.f', 'g'], ['testvalue.r', 'fe']])
    })
  }
}
