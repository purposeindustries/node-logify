import filter from './filter';

export default function create(field, pattern, ...appenders) {
  let fn;
  if (typeof pattern === 'function') {
    fn = function (entry) {
      return pattern(entry[field]);
    };
  } else if (typeof pattern === 'string') {
    fn = function test(entry) {
      return field[entry] === pattern;
    };
  } else if (pattern instanceof RegExp) {
    fn = function test(entry) {
      return pattern.test(entry[field]);
    };
  } else {
    throw new Error('Pattern should be a string!');
  }
  return filter(fn, ...appenders);
}
