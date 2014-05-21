'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Drop', function () {
  var knex, manager, schemas;

  beforeEach(function () {
    knex = { schema: {} };
  });

  describe('given empty arguments', function () {
    beforeEach(function () {
      knex.schema.hasTable = sinon.spy();
      manager = new Manager(knex);
    });

    it('should do nothing', function (done) {
      manager.drop()
      .then(function () {
        expect(knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given no schemas', function () {
    beforeEach(function () {
      knex.schema.hasTable = sinon.spy();
      manager = new Manager(knex);
      schemas = [];
    });

    it('should do nothing', function (done) {
      manager.drop(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given schemas', function () {
    beforeEach(function () {
      knex.schema.dropTableIfExists = sinon.stub().returns(Promise.resolve());
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' }
      ];
      manager = new Manager(knex);
    });

    it('should try to drop table', function (done) {
      manager.drop(schemas)
      .then(function () {
        expect(knex.schema.dropTableIfExists).to.have.been.calledTwice;
        expect(knex.schema.dropTableIfExists).to.have.been.calledWith('a');
        expect(knex.schema.dropTableIfExists).to.have.been.calledWith('b');
        done();
      })
      .catch(done);
    });
  });
});