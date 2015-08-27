export default function (entry) {
  if (!entry.res) {
    return entry;
  }

  const res = entry.res;
  entry.res = {
    statusCode: res.statusCode,
    header: res._header
  };
  return entry;
}
