import { format } from 'util';

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

    return this.log(extend({}, this.context, context));
  };
}

class Logger {
  constructor(context = {}, parent) {
    this.context = context;
    this.parent = parent;
    this.transformers = [];
    this.appenders = [];
  }

  transformed(entry) {
    if (this.parent) {
      entry = this.parent.transformed(entry);
    }
    for (const transformer of this.transformers) {
      entry = transformer(entry);
    }
    return entry;
  }

  log(entry) {
    entry = this.transformed(entry);
    for (const appender of this.appenders) {
      appender(entry);
    }
  }

  transform(field, fn, always) {
    if (typeof field === 'function') {
      this.transformers.push(field);
      return this;
    } else if (always) {
      this.transformers.push(function (entry) {
        entry[field] = fn(entry[field]);
        return entry;
      });
    } else {
      this.transformers.push(function (entry) {
        if (entry[field]) {
          entry[field] = fn(entry[field]);
        }
        return entry;
      });
    }
    return this;
  }

  append(appender) {
    this.appenders.push(appender);
    return this;
  }

  child(context) {
    const logger = new Logger(extend({}, this.context, context), this);
    return logger;
  }

  component(name) {
    return new Logger({}, this.context, {
      component: this.context.component ? (this.context.component + '.' + name) : name
    });
  }
}

[
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
