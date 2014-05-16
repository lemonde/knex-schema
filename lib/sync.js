'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Resolver = require('./resolver');

/**
 * Module interface.
 */

module.exports = sync;

/**
 * Synchronize given schemas with database.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

function sync(schemas) {
  var resolver = new Resolver(schemas);
  // Reduce force sequential execution.
  return Promise.reduce(resolver.resolve(), syncSchema.bind(this), []);
}

/**
 * Synchronize given schema with database.
 *
 * @param {Schema} schema
 * @return {Promise}
 */

function syncSchema(result, schema) {
  var knex = this.db.bookshelf.knex;
  return knex.schema.hasTable(schema.tableName)
  .then(function (exists) {
    if (exists) return result;
    return knex.schema.createTable(schema.tableName, defineSchemaTable(schema))
    .then(function () {
      return result.concat([schema]);
    });
  });
}

/**
 * Define default properties on the given schema.
 *
 * @param {Schema} schema
 * @return {Function}
 */

function defineSchemaTable(schema) {
  return function (table) {
    table.engine('InnoDB');
    table.timestamps();
    table.charset('utf8');
    (schema.build || _.noop)(table);
  };
}