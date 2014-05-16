'use strict';

var Promise = require('bluebird');
var Resolver = require('./resolver');

/**
 * Module interface.
 */

module.exports = populate;

/**
 * Populate schemas tables with schemas data.
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

function populate(schemas) {
  var resolver = new Resolver(schemas);
  // Reduce force sequential execution.
  return Promise.reduce(resolver.resolve(), populateSchema.bind(this), []);
}

/**
 * Populate schema table with schema data.
 *
 * @param {[Schema]} result - reduce accumulator
 * @param {Schema} schema
 * @return {Promise}
 */

function populateSchema(result, schema) {
  var knex = this.db.knex;
  return knex.schema.hasTable(schema.tableName)
  .then(function (exists) {
    if (! exists || ! schema.populate) return result;
    return schema.populate(knex)
    .then(function () {
      return result.concat([schema]);
    });
  });
}