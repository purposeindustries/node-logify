'use strict';

var logify = require('..');
var sinon = require('sinon');

describe('Logger', function() {
  describe('.log', function() {
    it('should exist', function() {
      var l = logify();
      l.log.should.be.an.instanceOf(Function);
    });
    it('should throw on unknown loglevel', function() {
      var l = logify();
      (function() {
        l.log('foo');
      }).should.throw();
    });
    it('should delegate to the proper level method', function() {
      var l = logify();
      var mock = sinon.mock(l);
      mock
        .expects('info')
        .once()
        .withArgs('foo %s', 'bar');
      l.log('info', 'foo %s', 'bar');
      mock.verify();
    });
  });
});
