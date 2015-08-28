import { format } from 'util';
import os from 'os';
import error from './serializer/error';
import req from './serializer/req';
import res from './serializer/res';

function extend(target, ...srcs) {
  for (const src of srcs) {
    for (const key in src) {
      target[key] = src[key];
    }
  }
  return target;
}

function makeLogger(level) {
  return function log(context, message, ...args) {
    // no context given
    if (typeof context === 'string') {
      args = [].slice.call(arguments, 1);
      message = context;
      context = null;
    }

    // context is an error
    if (context instanceof Error) {
      context = {
        error: context,
      };
      if (message == undefined) {
        message = context.error.message;
      }
    }

    if (!context) {
      context = {};
    }

    if (message) {
      context.message = format(message, ...args);
    }
    context.level = level;
    context.time = context.time || new Date();

    return this.log(extend({}, this.context, context));
  };
}

class Logger {
  constructor(context = {}, parent) {
    this.context = context;
    this.parent = parent;
    this.serializers = [];
    this.transports = parent ? parent.transports : [];
    context.pid = process.pid;
    context.hostname = os.hostname();
    context.arch = process.arch;
    context.platform = process.platform;

    this
      .transform(error)
      .transform(req)
      .transform(res);
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
