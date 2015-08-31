import res from './res';
import { equal as eq } from 'assert';

describe('serializer/res', function () {
  it('should ignore entry when res is not present', function () {
    eq(res({}).res, undefined);
  });
  [
    ['statusCode', 'statusCode'],
    ['header', '_header'],
  ].forEach(function ([to, from]) {
    it(`should serialize ${to}`, function () {
      eq(res({
        res: {
          [from]: from,
        },
      }).res[to], from);
    });
  });
});
