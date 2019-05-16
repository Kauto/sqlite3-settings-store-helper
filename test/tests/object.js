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

    it('should set a object and get a object', async function () {
      await settings.set('testvalue', { r: 'fe' })
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.deep.equal({ r: 'fe' })
    })

    it('should set a object and get a object from database', async function () {
      await settings.set('testvalue', { r: 'fe' })

      settings = new Settings(Object.assign({}, options, { db }))
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue')).to.deep.equal({ r: 'fe' })
    })

    it('should set a object and get a object-part', async function () {
      await settings.set('testvalue', { a: { r: 'fe' } })
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue.a')).to.deep.equal({ r: 'fe' })
    })

    it('should set a object and get a object-part from database', async function () {
      await settings.set('testvalue', { a: { r: 'fe' } })

      settings = new Settings(Object.assign({}, options, { db }))
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('testvalue.a')).to.deep.equal({ r: 'fe' })
    })

    it('should deep load a value from default object', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('a.b')).to.equal('c')
    })

    it('should load object from default value', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(await settings.get('a')).to.deep.equal({ b: 'c' })
    })
  }
}
