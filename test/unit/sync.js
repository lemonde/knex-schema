'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Sync', function () {
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
      manager.sync()
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
      manager.sync(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.not.have.been.called;
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
      db.knex.schema.createTable = sinon.spy(function () {
        return Promise.resolve();
      });
      schemas = [
        { tableName: 'a', build: sinon.spy() },
        { tableName: 'b', build: sinon.spy() }
      ];
      manager = new Manager(db);
    });

    it('should do nothing', function (done) {
      manager.sync(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.have.been.calledTwice;
        expect(db.knex.schema.hasTable).to.have.been.calledWith('a');
        expect(db.knex.schema.hasTable).to.have.been.calledWith('b');
        expect(db.knex.schema.createTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given non existing schemas', function () {
    var table;

    beforeEach(function () {
      table = {
        engine: sinon.spy(),
        timestamps: sinon.spy(),
        charset: sinon.spy()
      };

      db.knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(false);
      });
      db.knex.schema.createTable = sinon.spy(function (tableName, tableFactory) {
        return Promise.resolve(tableFactory(table));
      });
      schemas = [
        { tableName: 'a', build: sinon.spy() },
        { tableName: 'b', build: sinon.spy() }
      ];
      manager = new Manager(db);
    });

    it('should create tables', function (done) {
      manager.sync(schemas)
      .then(function () {
        expect(db.knex.schema.hasTable).to.have.been.calledTwice;
        expect(db.knex.schema.hasTable).to.have.been.calledWith('a');
        expect(db.knex.schema.hasTable).to.have.been.calledWith('b');
        expect(db.knex.schema.createTable).to.have.been.calledTwice;
        expect(db.knex.schema.createTable).to.have.been.calledWith('a');
        expect(db.knex.schema.createTable).to.have.been.calledWith('b');
        expect(table.engine).to.have.been.calledTwice;
        expect(table.engine).to.have.been.calledWith('InnoDB');
        expect(table.timestamps).to.have.been.calledTwice;
        expect(table.charset).to.have.been.calledTwice;
        expect(table.charset).to.have.been.calledWith('utf8');
        expect(schemas[0].build).to.have.been.calledOnce;
        expect(schemas[0].build).to.have.been.calledWith(table);
        expect(schemas[1].build).to.have.been.calledOnce;
        expect(schemas[1].build).to.have.been.calledWith(table);
        done();
      })
      .catch(done);
    });
  });
});