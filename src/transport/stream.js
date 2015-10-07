export default function create(stream, layout) {
  return function log(entry) {
    return new Promise((resolve, reject) => {
      stream.write(layout(entry), err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };
}
