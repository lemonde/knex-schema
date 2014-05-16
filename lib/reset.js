'use strict';

var Promise = require('bluebird');
var Resolver = require('./resolver');

/**
 * Module interface.
 */

module.exports = reset;

/**
 * Delete schemas tables data.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

function reset(schemas) {
  var resolver = new Resolver(schemas);
  // Reduce force sequential execution.
  return Promise.reduce(resolver.resolve().reverse(), resetSchema.bind(this), []);
}

/**
 * Delete schemas table data.
 *
 * @param {[Schema]} result - reduce accumulator
 * @param {Schema} schema
 * @return {Promise}
 */

function resetSchema(result, schema) {
  var knex = this.db.bookshelf.knex;
  return knex.schema.hasTable(schema.tableName)
  .then(function (exists) {
    if (! exists) return result;
    return knex(schema.tableName).del();
  });
}