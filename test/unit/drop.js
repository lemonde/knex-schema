'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Drop', function () {
  var db, manager, schemas;

  beforeEach(function () {
    db = { knex: { schema: {} } };
  });

  describe('given empty arguments', function () {
    beforeEach(function () {
      db.knex.schema.hasTable = sinon.spy();
      manager = new Manager(db);
    });

    it('should do nothing', function (done) {
      manager.drop()
      .then(function () {
        expect(db.knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given no schemas', function () {
    beforeEach(function () {
      db.knex.schema.hasTable = sinon.spy();
      manager = new Manager(db);
      schemas = [];
    });

    it('should do nothing', function (done) {
      manager.drop(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given schemas', function () {
    beforeEach(function () {
      db.knex.schema.dropTableIfExists = sinon.stub().returns(Promise.resolve());
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' }
      ];
      manager = new Manager(db);
    });

    it('should try to drop table', function (done) {
      manager.drop(schemas)
      .then(function () {
        expect(db.knex.schema.dropTableIfExists).to.have.been.calledTwice;
        expect(db.knex.schema.dropTableIfExists).to.have.been.calledWith('a');
        expect(db.knex.schema.dropTableIfExists).to.have.been.calledWith('b');
        done();
      })
      .catch(done);
    });
  });
});