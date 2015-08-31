import udp from './udp';
import json from '../formatter/json';
import dgram from 'dgram';
import net from 'net';
import stream from './stream';

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
  opts.type = opts.type || 'tcp';
  opts.transform = opts.transform || id;
  opts.formatter = opts.formatter || json;

  if (opts.type === 'udp') {
    const socket = dgram.createSocket('udp4');
    return udp(socket, opts.port, opts.host, compose(opts.formatter, opts.transform));
  } else if (opts.type === 'tcp') {
    const socket = net.connect(opts.port, opts.host);
    return stream(socket, compose(opts.formatter, opts.transform));
  }

  throw new Error(`Transport type ${opts.type} not implemented!`);
}
