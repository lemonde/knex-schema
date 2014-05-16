'use strict';

var sync = require('./sync');
var reset = require('./reset');
var populate = require('./populate');

/**
 * Module interface.
 */

module.exports = function (db) {
  return new Manager(db);
};

/**
 * Schemas manager.
 *
 * @param {PgDatabase} db
 */

function Manager(db) {

  /**
   * @property {PgDatabase} db - from pg-database
   */

  Object.defineProperty(this, 'db', { value: db });
}

/**
 * Synchronize given schemas with database.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

Manager.prototype.sync = sync;

/**
 * Populate schemas tables with schemas data.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

Manager.prototype.populate = populate;

/**
 * Delete schemas tables data.
 *
 * @param {[Schemas]} schemas
 * @param {Promise}
 */

Manager.prototype.reset = reset;

/**
 */

Manager.prototype.drop = function (schemas) {
};