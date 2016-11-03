'use strict';

var schemas = require('../fixtures/schemas');
var Manager = require('../../');
var knex = require('knex');

describe('Manager', function () {
  var manager;

  before(function () {
    manager = new Manager(knex({
      client: 'sqlite',
      connection: {
        filename: ':memory:'
      }
    }));
  });

  after(function () {
    manager.knex.client.pool.destroy();
  });

  it('should sync schemas', function (done) {
    manager.sync(schemas)
    .then(function () {
      return manager.knex.schema.hasTable('first');
    })
    .then(function (exists) {
      expect(exists).to.be.true;
      return manager.knex.schema.hasTable('second');
    })
    .then(function (exists) {
      expect(exists).to.be.true;
      done();
    })
    .catch(done);
  });

  it('should populate schemas', function (done) {
    manager.populate(schemas)
    .then(function () {
      return manager.knex('first').select();
    })
    .then(function (rows) {
      expect(rows).to.eql([
        { id: 1, content: 'first-foo', created_at: null, updated_at: null },
        { id: 2, content: 'first-bar', created_at: null, updated_at: null },
      ]);
      return manager.knex('second').select();
    })
    .then(function (rows) {
      expect(rows).to.eql([
        { id: 1, content: 'second-foo', created_at: null, updated_at: null },
        { id: 2, content: 'second-bar', created_at: null, updated_at: null },
      ]);
      done();
    })
    .catch(done);
  });

  it('should reset schemas', function (done) {
    manager.reset(schemas)
    .then(function () {
      return manager.knex('first').select();
    })
    .then(function (rows) {
      expect(rows).to.eql([]);
      return manager.knex('second').select();
    })
    .then(function (rows) {
      expect(rows).to.eql([]);
      done();
    })
    .catch(done);
  });

  it('should drop schemas', function (done) {
    manager.drop(schemas)
    .then(function () {
      return manager.knex.schema.hasTable('first');
    })
    .then(function (exists) {
      expect(exists).to.be.false;
      return manager.knex.schema.hasTable('second');
    })
    .then(function (exists) {
      expect(exists).to.be.false;
      done();
    })
    .catch(done);
  });
});