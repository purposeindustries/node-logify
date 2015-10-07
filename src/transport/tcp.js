import reconnect from 'reconnect-net';
import json from '../formatter/json-line';

export default function create(opts = {}) {
  opts.host = opts.host || 'localhost';
  opts.port = opts.port || 8192;
  opts.formatter = opts.formatter || json;
  let socket;

  reconnect(sock => {
    socket = sock;
  }).connect(opts.port, opts.host);

  return function write(entry) {
    if (!socket) {
      return Promise.reject(new Error('Socket not available!'));
    }
    return new Promise((resolve, reject) => {
      socket.write(opts.formatter(entry), err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  };
}
