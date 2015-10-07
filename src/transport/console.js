import consoleLayout from '../formatter/console';

export default function create(layout = consoleLayout) {
  return function log(entry) {
    const target = entry.level && ['warn', 'error', 'critical'].indexOf(entry.level) > -1 ? process.stderr : process.stdout;
    return new Promise((resolve, reject) => {
      target.write(layout(entry), err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };
}
