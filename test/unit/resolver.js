'use strict';

var Resolver = require('../../lib/resolver');

describe('Resolver', function () {
  var resolver, schemas;

  describe('given empty arguments', function () {
    beforeEach(function () {
      resolver = new Resolver();
    });

    it('should resolve empty array', function () {
      expect(resolver.resolve()).to.eql([]);
    });
  });

  describe('given empty array', function () {
    beforeEach(function () {
      resolver = new Resolver();
    });

    it('should resolve empty array', function () {
      expect(resolver.resolve()).to.eql([]);
    });
  });

  describe('given schemas without dependencies', function () {
    beforeEach(function () {
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' },
        { tableName: 'c' }
      ];

      resolver = new Resolver(schemas);
    });

    it('should not sort schemas', function () {
      expect(resolver.resolve()).to.eql([
        { tableName: 'a' },
        { tableName: 'b' },
        { tableName: 'c' }
      ]);
    });
  });

  describe('given schemas with dependencies', function () {
    beforeEach(function () {
      schemas = [
        { tableName: 'a', deps: [ 'b', 'c' ] },
        { tableName: 'b' },
        { tableName: 'c', deps: ['b'] }
      ];

      resolver = new Resolver(schemas);
    });

    it('should sort schemas resolving dependencies', function () {
      expect(resolver.resolve()).to.eql([
        { tableName: 'b' },
        { tableName: 'c', deps: ['b'] },
        { tableName: 'a', deps: [ 'b', 'c' ] }
      ]);
    });
  });
});