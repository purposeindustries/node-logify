import http from 'http';
import { parse } from 'url';
import extend from '../lib/extend';
import json from '../formatter/json';

export default function create(url, opts = {}) {
  opts.method = opts.method || 'POST';
  opts.formatter = opts.formatter || json;
  return function (entry) {
    const req = http.request(extend(parse(url), opts));
    req.end(opts.formatter(entry));
  };
}
