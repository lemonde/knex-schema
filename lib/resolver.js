'use strict';

var _ = require('lodash');

/**
 * Module interface.
 */

module.exports = Resolver;

/**
 * Resolver constructor.
 *
 * @param {[Schema]} schemas - an array of schemas to resolve
 */

function Resolver(schemas) {

  /**
   * @property [Schema] schemas
   */

  Object.defineProperty(this, 'schemas', { value: schemas || [] });
}

/**
 * Sort Resolver schemas meeting dependencies.
 *
 * @return [Schema]
 */

Resolver.prototype.resolve = function () {
  var result = [];
  var stack = this.schemas.slice();

  while (stack.length) {
    if (isResolved(stack[0], result))
      result.push(stack.shift());
    else
      stack.push(stack.shift());
  }

  return result;
};

/**
 * Return true if given schema.deps meet
 * schemas entries.
 *
 * @param Schema schema
 * @param [Schema] schemas
 * @return {Boolean}
 */

function isResolved(schema, schemas) {
  return (schema.deps || []).every(_.partial(function (tableNames, tableName) {
    return tableNames.indexOf(tableName) > -1;
  }, _.pluck(schemas, 'tableName')));
}