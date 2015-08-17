export default function create(fn, ...appenders) {
  return function log(entry) {
    if (!fn(entry)) {
      return;
    }
    for (const appender of appenders) {
      appender(entry);
    }
  };
}
