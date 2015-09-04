import dgram from 'dgram';
import json from '../formatter/json-line';

export default function create(opts = {}) {
  opts.type = opts.type || 'udp4';
  opts.host = opts.host || 'localhost';
  opts.port = opts.port || 8192;
  opts.layout = opts.layout || json;

  const socket = dgram.createSocket(opts.type);

  return function log(entry) {
    const message = opts.layout(entry);
    return socket.send(message, 0, message.length, opts.port, opts.host);
  };
}
