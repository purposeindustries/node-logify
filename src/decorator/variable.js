export default function create(key, fn) {
  return function transform(entry) {
    entry[key] = fn();
    return entry;
  };
}
