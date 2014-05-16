'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Populate', function () {
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
      manager.populate()
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
      manager.populate(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given missing schemas', function () {
    beforeEach(function () {
      db.knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(false);
      });
      schemas = [
        { tableName: 'a', populate: sinon.spy() },
        { tableName: 'b', populate: sinon.spy() }
      ];
      manager = new Manager(db);
    });

    it('should do nothing', function (done) {
      manager.populate(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.have.been.calledTwice;
        expect(db.knex.schema.hasTable).to.have.been.calledWith('a');
        expect(db.knex.schema.hasTable).to.have.been.calledWith('b');
        expect(schemas[0].populate).to.not.have.been.called;
        expect(schemas[1].populate).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given existing schemas', function () {
    beforeEach(function () {
      db.knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(true);
      });
      schemas = [
        { tableName: 'a', populate: sinon.stub().returns(Promise.resolve()) },
        { tableName: 'b', populate: sinon.stub().returns(Promise.resolve()) }
      ];
      manager = new Manager(db);
    });

    it('should populate tables', function (done) {
      manager.populate(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.have.been.calledTwice;
        expect(db.knex.schema.hasTable).to.have.been.calledWith('a');
        expect(db.knex.schema.hasTable).to.have.been.calledWith('b');
        expect(schemas[0].populate).to.have.been.calledOnce;
        expect(schemas[1].populate).to.have.been.calledOnce;
        done();
      })
      .catch(done);
    });
  });
});