'use strict';

var Manager = require('../../lib/manager');

describe('Manager', function () {
  it('should have knex', function () {
    expect(new Manager('some-knex')).to.have.property('knex', 'some-knex');
  });
});