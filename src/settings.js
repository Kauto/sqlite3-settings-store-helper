let DB = null
try {
  DB = require('sqlite3-helper/no-generators')
} catch (e) {
  DB = require('better-sqlite3-helper')
}
const AwaitLock = require('await-lock')
const objectPathGet = require('object-path-get')
const objectPathSet = require('object-path-set')

let instance = null

// helper
function generateLikeTermForObjectSearch (key, seperator) {
  return `${key.replace('?', '\\?').replace('%', '\\%')}${seperator.replace('?', '\\?').replace('%', '\\%')}%`
}

/**
 * Class to control key-value-settings
 *
 * @returns {Setting}
 * @constructor
 */
function Setting (options) {
  if (!(this instanceof Setting)) {
    instance = instance || new Setting(options)
    return instance
  }
  this.settings = undefined
  this.options = Object.assign({
    tableName: 'KeyValue',
    cache: true,
    serialize: JSON.stringify,
    unserialize: JSON.parse,
    seperator: '.',
    defaults: {}
  }, options)
  this.awaitLock = new AwaitLock()
  this.checkedForTable = false
}

Setting.prototype.initTable = async function () {
  await this.awaitLock.acquireAsync()
  if (this.checkedForTable) {
    this.awaitLock.release()
    return true
  }
  try {
    await DB().run(
      `CREATE TABLE IF NOT EXISTS \`${this.options.tableName}\` (
        \`key\` TEXT NOT NULL UNIQUE,
        \`value\` BLOB NOT NULL,
        PRIMARY KEY(\`key\`)
      );`)
    this.checkedForTable = true
  } catch (e) {
    console.error(e)
    throw e
  } finally {
    this.awaitLock.release()
  }
  return true
}

Setting.prototype.getSettings = async function (force = false) {
  await this.initTable()
  await this.awaitLock.acquireAsync()
  if (this.options.cache && this.settings) {
    this.awaitLock.release()
    return this.settings
  }

  try {
    this.settings = (await DB().query(`SELECT \`key\`, \`value\` FROM \`${this.options.tableName}\``)).reduce((loadedObject, v) => {
      objectPathSet(loadedObject, v.key, this.options.unserialize(v.value), this.options.seperator)
      return loadedObject
    }, this.options.defaults)
  } catch (e) {
    console.error(e)
    throw e
  } finally {
    this.awaitLock.release()
  }
  return this.settings
}

Setting.prototype.get = async function (key, defaultValue = undefined) {
  if (this.options.cache) {
    return objectPathGet((await this.getSettings()), key, defaultValue, this.options.seperator)
  }
  await this.initTable()
  const value = await DB().queryFirstCell(`SELECT \`value\` FROM \`${this.options.tableName}\` WHERE \`key\`=?`, key)
  return this.options.unserialize(
    value === undefined
      ? await DB().queryColumn('value', `SELECT \`value\` FROM \`${this.options.tableName}\` WHERE \`key\` like ?`, generateLikeTermForObjectSearch(key, this.options.seperator))
      : value
  )
}

Setting.prototype.set = async function (key, value) {
  await this.initTable()
  if (this.options.cache) {
    await this.awaitLock.acquireAsync()
    if (this.settings) {
      objectPathSet(this.settings, key, value, this.options.seperator)
    }
  }
  try {
    if (value === undefined) {
      await DB().query(`DELETE FROM \`${this.options.tableName}\` WHERE \`key\` = ?`, key)
    } else {
      await DB().query(`REPLACE INTO \`${this.options.tableName}\`(\`key\`,\`value\`) VALUES (?, ?)`, key, this.options.serialize(value))
    }
  } catch (e) {
    console.error(e)
    throw e
  } finally {
    if (this.options.cache) {
      this.awaitLock.release()
    }
  }
}

module.exports = Setting
