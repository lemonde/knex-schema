'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Reset', function () {
  var knex, manager, schemas, del;

  beforeEach(function () {
    del = sinon.stub().returns(Promise.resolve());
    knex = function () {
      return { del: del };
    };
    knex.schema = {};
  });

  describe('given empty arguments', function () {
    beforeEach(function () {
      knex.schema.hasTable = sinon.spy();
      manager = new Manager(knex);
    });

    it('should do nothing', function (done) {
      manager.reset()
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
      manager.reset(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given missing schemas', function () {
    beforeEach(function () {
      knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(false);
      });
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' }
      ];
      manager = new Manager(knex);
    });

    it('should do nothing', function (done) {
      manager.reset(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.have.been.calledTwice;
        expect(knex.schema.hasTable).to.have.been.calledWith('a');
        expect(knex.schema.hasTable).to.have.been.calledWith('b');
        expect(del).to.not.have.been.called;
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
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' }
      ];
      manager = new Manager(knex);
    });

    it('should delete data', function (done) {
      manager.reset(schemas)
      .then(function () {
        expect(knex.schema.hasTable).to.have.been.calledTwice;
        expect(knex.schema.hasTable).to.have.been.calledWith('a');
        expect(knex.schema.hasTable).to.have.been.calledWith('b');
        expect(del).to.have.been.calledTwice;
        done();
      })
      .catch(done);
    });
  });
});