import { format } from 'util';
import os from 'os';
import error from './serializer/error';
import req from './serializer/req';
import res from './serializer/res';
import extend from './lib/extend';
import makeLogger from './lib/make-log-level';


class Logger {
  constructor(context = {}, parent) {
    this.context = context;
    this.parent = parent;
    this.serializers = [];
    this.transports = parent ? parent.transports : [];

    if (!this.parent) {
      this
        .transform(error)
        .transform(req)
        .transform(res);
    }
  }

  serialize(entry) {
    if (this.parent) {
      entry = this.parent.serialize(entry);
    }
    for (const serializer of this.serializers) {
      entry = serializer(entry);
    }
    return entry;
  }

  log(entry) {
    entry = this.serialize(entry);
    for (const transport of this.transports) {
      transport(entry);
    }
  }

  transform(field, fn, always) {
    if (typeof field === 'function') {
      this.serializers.push(field);
      return this;
    } else if (always) {
      this.serializers.push(function (entry) {
        entry[field] = fn(entry[field]);
        return entry;
      });
    } else {
      this.serializers.push(function (entry) {
        if (entry[field]) {
          entry[field] = fn(entry[field]);
        }
        return entry;
      });
    }
    return this;
  }

  add(transport) {
    this.transports.push(transport);
    return this;
  }

  child(context) {
    const logger = new Logger(extend({}, this.context, context), this);
    return logger;
  }

  component(name) {
    return this.child({
      component: this.context.component ? (this.context.component + '.' + name) : name
    });
  }

  use(plugin) {
    return plugin(this);
  }
}

[
  'trace',
  'debug',
  'info',
  'notice',
  'warn',
  'error',
  'critical',
].forEach(function (level) {
  Logger.prototype[level] = makeLogger(level);
});

module.exports = Logger;
