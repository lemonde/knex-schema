'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var Resolver = require('./resolver');

/**
 * Module interface.
 */

module.exports = drop;

/**
 * Drop schemas tables. If it exists, it calls `preDrop` beforehand
 *
 * @param {[Schemas]} schemas
 * @return {Promise}
 */

function drop(schemas) {
  var resolver = new Resolver(schemas);
  var knex = this.knex;
  return Promise.map(schemas || [], function(schema) {
    return (schema.preDrop || _.noop)(knex);
  })
  .then(function () {
    // Reduce force sequential execution.
    return Promise.reduce(resolver.resolve().reverse(), dropSchema.bind(this), []);
  }.bind(this));
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