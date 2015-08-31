import req from './req';
import { equal as eq } from 'assert'

describe('serializer/req', function () {
  it('should ignore entry when req is not present', function () {
    eq(req({}).req, undefined);
  });
  [
    'method',
    'url',
    'headers',
  ].forEach(function (field) {
    it(`should serialize ${field}`, function () {
      eq(req({
        req: {
          [field]: field,
        },
      }).req[field], field);
    });
  });
  it('should serialize requestId', function () {
    eq(req({
      req: {},
      context: {
        requestId: 123,
      },
    }).req.requestId, 123);
  });
  it('should serialize remodeAddress', function () {
    eq(req({
      req: {
        connection: {
          remoteAddress: '127.0.0.1',
        },
      },
    }).req.ip, '127.0.0.1');
  });
});
