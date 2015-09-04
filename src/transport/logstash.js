import udp from './udp';
import tcp from './tcp';
import json from '../formatter/json';

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
    return udp({
      host: opts.host,
      port: opts.port,
      type: 'udp4',
      formatter: compose(opts.formatter, opts.transform),
    });
  } else if (opts.type === 'tcp') {
    return tcp({
      host: opts.host,
      port: opts.port,
      formatter: compose(opts.formatter, opts.transform),
    });
  }

  throw new Error(`Transport type ${opts.type} not implemented!`);
}
