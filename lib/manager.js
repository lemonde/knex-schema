'use strict';

var drop = require('./drop');
var sync = require('./sync');
var reset = require('./reset');
var populate = require('./populate');

/**
 * Module interface.
 */

module.exports = Manager;

/**
 * Schemas manager.
 *
 * @param {Knex} knex
 */

function Manager(knex) {

  /**
   * @property {Knex} knex - from pg-database
   */

  Object.defineProperty(this, 'knex', { value: knex });
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
 * Drop schemas tables.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

Manager.prototype.drop = drop;