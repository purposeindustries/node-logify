'use strict';

var os = require('os');
var extend = require('extend-object');

var defaultLevels = require('logify-syslog-levels');
var defaultTransport = require('logify-console-transport');

function setupLevel(level) {
  this[level.name] = function(err, message) {
    var args, meta;
    if (!(err instanceof Error) && typeof err == 'string') {
      message = err;
      err = undefined;
      args = [].slice.call(arguments, 1);
    } else if (!(err instanceof Error)) {
      meta = err;
      err = undefined;
      args = [].slice.call(arguments, 2);
    } else {
      args = [].slice.call(arguments, 2);
      if (!message) {
        message = err.message;
      }
    }
    this._log(
      level,
      err,
      meta || {},
      message || '',
      args
    );
  };
}

function dispatchMessage(message, transport) {
  if (transport.silent || transport.level < message.level.code) {
    return;
  }
  transport.log(message, this);
}

function Logger(opts) {
  opts = opts || {};

  this.context = extend({
    pid: process.pid,
    host: os.hostname(),
  }, opts.context || {});

  this.serializers = opts.serializers || {};

  this.transports = opts.transports || [
    defaultTransport(),
  ];

  this.silent = opts.silent;

  this.levels = opts.levels || defaultLevels;
  this.levels.forEach(setupLevel, this);
}

Logger.prototype.child = function child(context) {
  var childLogger = Object.create(this);
  childLogger.context = extend({}, this.context, context);
  return childLogger;
};

Logger.prototype.component = function component(name) {
  return this.child({
    component:
      this.context.component
      ? this.context.component + '.' + name
      : name
  });
};

Logger.prototype.serialize = function serialize(name, fn) {
  this.serializers[name] = fn;
};

Logger.prototype.add = function add(transport) {
  this.transports.push(transport);
};

Logger.prototype._log = function _log(level, err, meta, msg, args) {
  if (this.silent) {
    return;
  }

  var message = {
    level: level,
    err: err,
    msg: msg,
    args: args,
    date: new Date(),
    context: this._serializeContext(
      extend({}, this.context, meta)
    ),
  };
  this.transports.forEach(dispatchMessage.bind(this, message));
};

Logger.prototype.log = function log(level) {
  if (!this.hasLevel(level)) {
    throw new Error('Loglevel ' + level + ' not found!');
  }
  this[level].apply(
    this,
    [].slice.call(arguments, 1)
  );
};

Logger.prototype.hasLevel = function hasLevel(name) {
  for (var i = 0; i < this.levels.length; i++) {
    var level = this.levels[i];
    if (level.name == name) {
      return true;
    }
  }
  return false;
};

Logger.prototype._serializeContext = function _serializeContext(context) {
  return Object.keys(context).reduce(function(serialized, key) {
    var val = context[key];
    if (this.serializers[key]) {
      val = this.serializers[key](val);
    }
    serialized[key] = val;
    return serialized;
  }.bind(this), {});
};

module.exports = function create(opts) {
  return new Logger(opts);
};
