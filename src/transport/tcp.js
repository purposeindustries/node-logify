import reconnect from 'reconnect-net';
import json from '../formatter/json-line';

export default function create(opts = {}) {
  opts.host = opts.host || 'localhost';
  opts.port = opts.port || 8192;
  opts.formatter = opts.formatter || json;
  let socket;

  const emitter = reconnect(sock => {
    socket = sock
    socket.on('error', err => console.error(err));
  }).connect(opts.port, opts.host);

  emitter.on('error', err => console.error(err));

  return function write(entry) {
    if (!socket) {
      return;
    }
    socket.write(opts.formatter(entry), err => console.error(err));
  };
}
