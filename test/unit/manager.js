'use strict';

var Manager = require('../../lib/manager');

describe('Manager', function () {
  it('should have db', function () {
    expect(new Manager('some-db')).to.have.property('db', 'some-db');
  });
});