import err from './error';
import { ok, equal as eq } from 'assert';

describe('serializer/error', function () {
  it('should do nothing when entry has no error', function () {
    eq(err({}).error, undefined);
  });
  [
    'message',
    'statusCode',
    'body',
    'stack',
    'code',
    'signal',
    'name',
  ].forEach(function (field) {
    it(`should serialize ${field} field`, function () {
      const e = new Error();
      e[field] = field;
      eq(err(e)[field], field);
    });
    if (['message', 'stack', 'name'].includes(field)) {
      return;
    }
    it(`should skip field ${field} when undefined`, function () {
      const e = new Error();
      eq(err(e)[field], undefined);
    });
  })
})
