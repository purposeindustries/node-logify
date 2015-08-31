import json from './json';
import { equal as eq } from 'assert';

describe('formatter/json', function () {
  it('should stringify regular objects', function () {
    eq(json({
      foo: 1,
      bar: 'baz',
      qux: 3.14,
      woof: [1, 2.3, 'xxx'],
      garply: {
        foo: {
          bar: {
            baz: 1337
          }
        }
      },
      q: undefined,
      z: null,
    }), '{"foo":1,"bar":"baz","qux":3.14,"woof":[1,2.3,"xxx"],"garply":{"foo":{"bar":{"baz":1337}}},"z":null}');
  });
  it('should stringify circular objects', function () {
    const a = {};
    const b = { a };
    a.b = b;
    eq(json(b), '{"a":{"b":"[Circular]"}}');
  });
});
