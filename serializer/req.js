export default function (entry) {
  if (!entry.req) {
    return entry;
  }

  const req = entry.req;
  entry.req = {
    requestId: entry.context.requestId,
    method: req.method,
    url: req.url,
    headers: req.headers,
    ip: req.connection.remoteAddress,
  };
  return entry;
}
