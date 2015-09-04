import reconnect from 'reconnect-net';
import json from '../formatter/json-line';

export default function create(opts = {}) {
  opts.host = opts.host || 'localhost';
  opts.port = opts.port || 8192;
  opts.formatter = opts.formatter || json;
  let socket;

  reconnect(sock => socket = sock).connect(opts.port, opts.host);

  return function write(entry) {
    socket.write(opts.formatter(entry));
  };
}
