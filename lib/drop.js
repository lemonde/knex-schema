'use strict';

var Promise = require('bluebird');
var Resolver = require('./resolver');

/**
 * Module interface.
 */

module.exports = drop;

/**
 * Drop schemas tables.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

function drop(schemas) {
  var resolver = new Resolver(schemas);
  // Reduce force sequential execution.
  return Promise.reduce(resolver.resolve().reverse(), dropSchema.bind(this), []);
}

/**
 * Drop schema table.
 *
 * @param {[Schema]} result - reduce accumulator
 * @param {Schema} schema
 * @return {Promise}
 */

function dropSchema(result, schema) {
  return this.knex.schema.dropTableIfExists(schema.tableName)
  .then(function () {
    return result.concat([schema]);
  });
}