export default function (entry) {
  if (!entry.error) {
    return entry;
  }
  const err = entry.error;
  entry.error = {
    message: err.message,
    statusCode: err.statusCode,
    body: err.body,
    stack: err.stack,
    code: err.code,
    signal: err.signal,
    name: err.name,
  };
  return entry;
}
