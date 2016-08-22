'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Sync', function () {
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
      manager.sync()
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
      manager.sync(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given existing schemas', function () {
    beforeEach(function () {
      knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(true);
      });
      knex.schema.createTable = sinon.spy(function () {
        return Promise.resolve();
      });
      schemas = [
        { tableName: 'a', build: sinon.spy() },
        { tableName: 'b', build: sinon.spy() }
      ];
      manager = new Manager(knex);
    });

    it('should do nothing', function (done) {
      manager.sync(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.have.been.calledTwice;
        expect(knex.schema.hasTable).to.have.been.calledWith('a');
        expect(knex.schema.hasTable).to.have.been.calledWith('b');
        expect(knex.schema.createTable).to.not.have.been.called;
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

      knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(false);
      });
      knex.schema.createTable = sinon.spy(function (tableName, tableFactory) {
        return Promise.resolve(tableFactory(table));
      });
      schemas = [
        { tableName: 'a', build: sinon.spy() },
        { tableName: 'b', build: sinon.spy() }
      ];
      manager = new Manager(knex);
    });

    it('should create tables', function (done) {
      manager.sync(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.have.been.calledTwice;
        expect(knex.schema.hasTable).to.have.been.calledWith('a');
        expect(knex.schema.hasTable).to.have.been.calledWith('b');
        expect(knex.schema.createTable).to.have.been.calledTwice;
        expect(knex.schema.createTable).to.have.been.calledWith('a');
        expect(knex.schema.createTable).to.have.been.calledWith('b');
        expect(table.timestamps).to.have.been.calledTwice;
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