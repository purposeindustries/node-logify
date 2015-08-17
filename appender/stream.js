export default function create(stream, layout) {
  return function log(entry) {
    return stream.write(layout(entry));
  };
}
