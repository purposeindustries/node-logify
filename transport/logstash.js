import udp from './udp';
import json from '../formatter/json';
import dgram from 'dgram';

function id(x) {
  return x;
}

function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

export default function create(opts = {}) {
  opts.host = opts.host || 'localhost';
  opts.port = opts.port || 8192;
  opts.type = opts.type || 'udp';
  opts.transform = opts.transform || id;
  opts.formatter = opts.formatter || json;

  if (opts.type !== 'udp') {
    throw new Error('Only UDP transport is implemented for Logstash!');
  }

  const socket = dgram.createSocket('udp4');
  return udp(socket, opts.port, opts.host, compose(opts.formatter, opts.transform));
}
