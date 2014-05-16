'use strict';

var sinon = require('sinon');
var Promise = require('bluebird');
var Manager = require('../../lib/manager');

describe('Reset', function () {
  var db, manager, schemas, del;

  beforeEach(function () {
    del = sinon.stub().returns(Promise.resolve());
    db = { bookshelf: {} };
    db.bookshelf.knex = function () {
      return { del: del };
    };
    db.bookshelf.knex.schema = {};
  });

  describe('given empty arguments', function () {
    beforeEach(function () {
      db.bookshelf.knex.schema.hasTable = sinon.spy();
      manager = new Manager(db);
    });

    it('should do nothing', function (done) {
      manager.reset()
      .then(function () {
        expect(db.bookshelf.knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given no schemas', function () {
    beforeEach(function () {
      db.bookshelf.knex.schema.hasTable = sinon.spy();
      manager = new Manager(db);
      schemas = [];
    });

    it('should do nothing', function (done) {
      manager.reset(schemas)
      .then(function () {
        expect(db.bookshelf.knex.schema.hasTable).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given missing schemas', function () {
    beforeEach(function () {
      db.bookshelf.knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(false);
      });
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' }
      ];
      manager = new Manager(db);
    });

    it('should do nothing', function (done) {
      manager.reset(schemas)
      .then(function () {
        expect(db.bookshelf.knex.schema.hasTable).to.have.been.calledTwice;
        expect(db.bookshelf.knex.schema.hasTable).to.have.been.calledWith('a');
        expect(db.bookshelf.knex.schema.hasTable).to.have.been.calledWith('b');
        expect(del).to.not.have.been.called;
        done();
      })
      .catch(done);
    });
  });

  describe('given existing schemas', function () {
    beforeEach(function () {
      db.bookshelf.knex.schema.hasTable = sinon.spy(function () {
        return Promise.resolve(true);
      });
      schemas = [
        { tableName: 'a' },
        { tableName: 'b' }
      ];
      manager = new Manager(db);
    });

    it('should delete data', function (done) {
      manager.reset(schemas)
      .then(function () {
        expect(db.bookshelf.knex.schema.hasTable).to.have.been.calledTwice;
        expect(db.bookshelf.knex.schema.hasTable).to.have.been.calledWith('a');
        expect(db.bookshelf.knex.schema.hasTable).to.have.been.calledWith('b');
        expect(del).to.have.been.calledTwice;
        done();
      })
      .catch(done);
    });
  });
});